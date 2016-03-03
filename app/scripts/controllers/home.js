'use strict';

/**
 * @ngdoc function
 * @name oerebApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the oerebApp
 */
angular.module('oerebApp')
    .controller('HomeCtrl', function ($scope, ngeoDecorateLayer, $base64, ngeoLocation) {
        var self = this;

        this.config = {
            zoom: {
                default: 5,
                zoomedIn: 18,
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

        var standardMap =  new ol.layer.Tile({
            source: new ol.source.OSM()
        });


        // restore permalink
        if(window.location.hash.indexOf('?') !== -1) {

            // try to restore center, zoom-level and rotation from the URL
            var basedHash = window.location.hash.replace('#/?', '') + '=';
            // var parts = hash.split('/');

            var hash = $base64.decode(basedHash);
            var parts = hash.split('/');


            if (parts.length === 3) {
                console.log('restoring');
                console.log(parts);

                this.zoom = parseInt(parts[0], 10);
                this.center = [
                    parseFloat(parts[1]),
                    parseFloat(parts[2])
                ];
            }
        }

        this.layers = mainLayers;

        this.layers.forEach(function(layer) {
            ngeoDecorateLayer(layer);
        });


        // projection
        var projection = ol.proj.get(self.config.projection.epsg);
        // projection.setExtent(self.config.projection.extent);

        // define view
        this.view = new ol.View({
            center: self.center,
            zoom: self.zoom,
            projection: projection,
        });

        this.map = new ol.Map({
            layers: this.layers,
            view: this.view
        });


        // permalink
        var shouldUpdate = true;
        var view = this.map.getView();
        var updatePermalink = function() {
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
                center: view.getCenter(),
            };
            window.history.pushState(state, 'map', hash);
        };

        this.map.on('moveend', updatePermalink);

        // onload set center from url
        window.addEventListener('popstate', function(event) {
            if (event.state === null) {
                return;
            }
            self.map.getView().setCenter(event.state.center);
            self.map.getView().setZoom(event.state.zoom);
            shouldUpdate = false;
        });




        // Popup showing the position the user clicked
       var popup = new ol.Overlay({
            element: document.getElementById('object-information')
        });

        this.map.addOverlay(popup);

        $('#object-information').hide();

        // click event listener
        this.map.on('singleclick', function(event) {

            var element = popup.getElement();
            var coordinate = event.coordinate;
            var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                coordinate, 'EPSG:3857', self.config.projection.epsg));

            $(element).hide();
            $(element).show();

            popup.setPosition(coordinate);

            // infos vom wms
            var viewResolution = (self.map.getView().getResolution());
            var url = wmsCantoneCadestral.getGetFeatureInfoUrl(
                event.coordinate, viewResolution, self.config.projection.epsg,
                {'INFO_FORMAT': 'application/json'}
            );

            if (url) {
                console.log(url);
                $.get(url, function(data) {
                    // do something with the result
                });
            }
        });

        var positionFeatureStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({color: 'rgba(230, 100, 100, 1)'}),
                stroke: new ol.style.Stroke({color: 'rgba(230, 40, 40, 1)', width: 2})
            })
        });

        var accuracyFeatureStyle = new ol.style.Style({
            fill: new ol.style.Fill({color: 'rgba(100, 100, 230, 0.3)'}),
            stroke: new ol.style.Stroke({color: 'rgba(40, 40, 230, 1)', width: 2})
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
                filter: function(locations) {
                    return locations.results;
                }
            }
        });
        placesSource.initialize();

        // load places into the typeahead directive
        this.places = {
            displayKey: function(location) {
                return location.attrs.label.replace('<b>', '').replace('</b>', '');
            },
            source: placesSource.ttAdapter()
        };

        // watch the Home.search model for changes
        $scope.$watch(function () {
            return self.search;
        }, function(value){
            if (self.search !== null && typeof self.search === 'object') {
                // center result
                self.map.getView().setCenter(ol.proj.transform([self.search.attrs.lon, self.search.attrs.lat], 'EPSG:4326', self.config.projection.epsg));
                self.map.getView().setZoom(self.config.zoom.zoomedIn);
            }
        });

        /*
         END TYPEHEAD SEARCH
         */

    });
