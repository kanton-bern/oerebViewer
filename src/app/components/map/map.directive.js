export function MapDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/map/map.html',
        controller: MapController,
        controllerAs: 'map',
        bindToController: true
    };

    return directive;
}

// use: WGS84 bzw. EPSG:4326

class MapController {
    constructor(Layers, $log, $http, ngeoDecorateLayer, ngeoLocation, $scope, $base64, $window, Oereb, Extracts) {
        'ngInject';

        this.$window = $window;
        this.$log = $log;
        this.$base64 = $base64;
        this.ol = ol;
        this.Oereb = Oereb;
        this.Extracts = Extracts;


        var self = this;

        this.config = {
            zoom: {
                default: 4,
                zoomedIn: 12
            },
            projection: {
                epsg: 'EPSG:21781',
                extent: [556537.4299988629, 133372.99984210846, 677228.07650191, 243445.06515347536]
            }
        }

        // 612644.12/195917.85/0
        this.center = [612644, 195917];
        this.zoom = this.config.zoom.default;

        // information text

        this.restore();

        $log.warn(Layers.get());

        Layers.get().forEach(function (layer) {
            ngeoDecorateLayer(layer);
        });


        let bottomSlider = $('.position-bottom');
        let $themeTitle = $('.slide-title');
        var vHeight = $(window).height() - 40;
        var $btnOpenTheme = $('#themeBottomToggler');

        $btnOpenTheme.click(function() {
            var topBarHeight = $('.header-sticky-container').height();
            if(bottomSlider.hasClass("slider-active")) {
                bottomSlider.animate({
                        top: vHeight
                    }, {
                        duration:400
                    }

                );
                // Modifying the title of the theme
                $themeTitle.css("margin-top","1em");
                $themeTitle.css("opacity","0.5");

            }
            if(bottomSlider.hasClass("slider-inactive")) {
                bottomSlider.animate({
                        top: 50
                    }, {
                        duration:400
                    }
                );
                // Modifying the title of the theme
                $themeTitle.css("margin-top","3em");
                $themeTitle.css("opacity","1");
            }
            bottomSlider.toggleClass("slider-active");
            bottomSlider.toggleClass("slider-inactive");

        });



        // projection
        this.projection = this.ol.proj.get(self.config.projection.epsg);

        // define view
        this.view = new this.ol.View({
            center: self.center,
            zoom: self.zoom,
            projection: this.projection
        });

        this.map = new this.ol.Map({
            layers: Layers.get(),
            view: this.view
        });

        this.zoomIn = function () {
            this.$log.warn('zoomIn');
            self.map.zoom = self.map.zoom + 1;
        };

        // permalink
        var shouldUpdate = true;
        var view = this.map.getView();
        var updatePermalink = function () {
            return true;

            if (!shouldUpdate) {
                // do not update the URL when the view was changed in the 'popstate' handler
                shouldUpdate = true;
                return;
            }

            var center = view.getCenter();

            // generate hash
            var hash = '/#/?' +
                $base64.encode(
                    view.getZoom() + '/' + center[0] + '/' + center[1]
                ).slice(0, -1);

            var state = {
                zoom: view.getZoom(),
                center: view.getCenter()
            };
            window.history.pushState(state, 'map', hash);
        };

        this.map.on('moveend', updatePermalink);

        // onload set center from url
        window.addEventListener('popstate', function (event) {
            if (event.state === null) {
                return;
            }
            self.map.getView().setCenter(event.state.center);
            self.map.getView().setZoom(event.state.zoom);
            shouldUpdate = false;
        });

        // click event listener
        this.map.on('singleclick', function (event) {
            self.onClickOnMap(event);
        });

        var positionFeatureStyle = new this.ol.style.Style({
            image: new this.ol.style.Circle({
                radius: 6,
                fill: new this.ol.style.Fill({color: 'rgba(230, 100, 100, 1)'}),
                stroke: new this.ol.style.Stroke({color: 'rgba(230, 40, 40, 1)', width: 2})
            })
        });

        var accuracyFeatureStyle = new this.ol.style.Style({
            fill: new this.ol.style.Fill({color: 'rgba(100, 100, 230, 0.3)'}),
            stroke: new this.ol.style.Stroke({color: 'rgba(40, 40, 230, 1)', width: 2})
        });

        this.mobileGeolocationOptions = {
            positionFeatureStyle: positionFeatureStyle,
            accuracyFeatureStyle: accuracyFeatureStyle,
            zoom: this.config.zoom.zoomedIn,
        };

        /*
         TYPEAHEAD SEARCH
         */

        // Initialize the suggestion engine
        var placesSource = new Bloodhound({
            limit: 30,
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: 'https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=%QUERY&type=locations',
                wildcard: '%QUERY',
                filter: function (locations) {
                    return locations.results;
                }
            }
        });
        placesSource.initialize();

        // load places into the typeahead directive
        this.places = {
            displayKey: function (location) {
                return location.attrs.label.replace('<b>', '').replace('</b>', '');
            },
            source: placesSource.ttAdapter()
        };

        // watch the home.search model for changes
        $scope.$watch(function () {
            return self.search;
        }, function (value) {
            if (self.search !== null && typeof self.search === 'object') {
                // center result
                self.map.getView().setCenter(self.ol.proj.transform([self.search.attrs.lon, self.search.attrs.lat], 'EPSG:4326', self.config.projection.epsg));
                self.map.getView().setZoom(self.config.zoom.zoomedIn);
            }
        });
    }

    // restore permalink
    restore() {
        if (window.location.hash.indexOf('?') !== -1) {

            // try to restore center, zoom-level and rotation from the URL
            var basedHash = window.location.hash.replace('#/?', '') + '=';
            // var parts = hash.split('/');

            var hash = this.$base64.decode(basedHash);
            var parts = hash.split('/');

            if (parts.length === 3) {
                this.zoom = parseInt(parts[0], 10);
                this.center = [
                    parseFloat(parts[1]),
                    parseFloat(parts[2])
                ];
            }
        }
    }

    addExtract(egrid) {
        var element = this.popup.getElement();
        $(element).hide();

        this.Extracts.add(
            {
                egrid: egrid
            }
        )
    }

    onClickOnMap(event) {
        self = this;
        // Popup showing the position the user clicked
        self.infocords = event.coordinate;

        var popup = new this.ol.Overlay({
            element: document.getElementById('infobox')
        });

        this.map.addOverlay(popup);

        $('#object-information').hide();

        this.$log.warn('clicked');
        var element = popup.getElement();
        var coordinate = event.coordinate;
        /*var hdms = this.ol.coordinate.toStringHDMS(ol.proj.transform(
         coordinate, 'EPSG:3857', self.config.projection.epsg)); */

        $(element).hide();
        $(element).show();

        popup.setPosition(coordinate);

        this.popup = popup;

        var cords = this.ol.proj.transform(coordinate, self.config.projection.epsg, 'EPSG:4326');

        this.egrids = [];
        this.infoboxLoading = true;
        this.Oereb.getEGRID(cords[1], cords[0]).then(function (d) {
            self.egrids = d.data;
            self.infoboxLoading = false;
        });


        let wmsCantoneCadestral = new this.ol.source.TileWMS(({
            url: 'http://www.geoservice.apps.be.ch/geoservice/services/a4p/a4p_planungwms_d_fk_s/MapServer/WMSServer?',
            params: {
                'LAYERS': 'GEODB.UZP_BAU_det',
                'TILED': true,
                'VERSION': '1.1.1',
                'FORMAT': 'image/png',
                //'CRS': 'EPSG:3857'
            },
            serverType: 'geoserver'
        }));

        var viewResolution = (this.map.getView().getResolution());
        var url = wmsCantoneCadestral.getGetFeatureInfoUrl(
            event.coordinate, viewResolution, this.config.projection.epsg,
            {'INFO_FORMAT': 'text/xml' /* application/json */}
        );


        if (url) {
            this.$log.warn(url);

            /*$http({
             method: 'get',
             url: url,
             }).then(function successCallback(response) {
             console.log(response);
             }, function errorCallback(response) {
             console.log(response);
             });*/

            /*$.ajax({

             url: url,
             type: 'GET',
             crossDomain: true,
             dataType: 'jsonp',
             success: function() { console.log("Success"); },
             error: function() { console.log('Failed!'); },
             beforeSend: setHeader,
             });*/

        }
    }

    test() {
        this.$log.warn('wtf');

    }
}
