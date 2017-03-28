export class DetailController {
    constructor($log, $translate, $window, Config, Extracts, Helpers, Map, Layers, $stateParams, $location, $scope, $rootScope, Coordinates, Loading, Notification, $filter) {
        'ngInject';

        // declarations
        let self = this;
        this.Extracts = Extracts;
        this.$translate = $translate;
        this.Config = Config;
        this.$location = $location;
        this.Map = Map;
        this.Layers = Layers;
        this.$filter = $filter;
        this.Coordinates = Coordinates;
        this.Helpers = Helpers;
        this.Loading = Loading;
        this.$window = $window;
        this.$stateParams = $stateParams;
        this.$scope = $scope;
        this.Notification = Notification;
        this.activeRestriction = null;

        // hide infobox overlay
        this.Map.hideOverlay();

        // remove selected layer
        this.Map.removeClickedLayer();

        // if there are no data available
        this.noDatas = true;
        if ($stateParams.egrid != 0) {
            this.addExtract($stateParams.egrid);
            this.noDatas = false;
        }

        // triggers restriction changed at startup
        this.restrictionChanged(false);

        // if location searchpath is changed, restrictionchanges
        $scope.$on('$locationChangeSuccess', function () {
            self.restrictionChanged(true);
        });

        $rootScope.$on('$translateChangeSuccess', function () {
            if ($stateParams.egrid != 0) {
                self.Extracts.reload();
            }
        });

        // on restriction reload add layer to map
        this.Extracts.registerRestrictionObserverCallback(function() {
            self.tempLayers = [];

            let bbox = '';

            if (angular.isDefined(self.Extracts.getRestriction()))
                angular.forEach(self.Extracts.getRestriction().values, function (v) {
                    bbox = Helpers.getParameterByName('bbox', v.Map.ReferenceWMS);

                    var indexOfWMSServer = v.Map.ReferenceWMS.indexOf('WMSServer?');

                    if (indexOfWMSServer == -1) {
                        var wmsTempSource = new self.Map.ol.source.TileWMS(({
                            url: v.Map.ReferenceWMS,
                            params: {
                                'TILED': true,
                            },
                            serverType: 'geoserver'
                        }));
                    }
                    else {
                        var url = v.Map.ReferenceWMS.substr(0, indexOfWMSServer) + 'WMSServer?';

                        var wmsTempSource = new self.Map.ol.source.TileWMS(({
                            url: url,
                            params: {
                                'LAYERS': Helpers.getParameterByName('LAYERS', v.Map.ReferenceWMS),
                                'TILED': true,
                                'VERSION': Helpers.getParameterByName('VERSION', v.Map.ReferenceWMS),
                                'FORMAT': Helpers.getParameterByName('FORMAT', v.Map.ReferenceWMS),
                                'CRS': Helpers.getParameterByName('CRS', v.Map.ReferenceWMS)
                            },
                            serverType: 'geoserver'
                        }));
                    }

                    let wmsTemp = new self.Map.ol.layer.Tile({
                        /*preload: Infinity,*/
                        opacity: 0.4,
                        visible: true,
                        source: wmsTempSource,
                        name: 'restriction-temp'
                    });


                    self.tempLayers.push(wmsTemp);
                });


            self.Map.addTempLayers(self.tempLayers);
        });


        // open detail menu on load
        Extracts.registerCurrentObserverCallback(function() {
            Helpers.openMenu();
        });

        // Menubutton in header will change to cross [x] if menu is open.
        var $menuNav = angular.element('.menu-nav');
        var $panel = angular.element('#menuLeftSlider');

        if ($panel.attr('aria-expanded')=='true') {
          $log.debug('active');
        }
    }

    expand(index, id) {
        if (id == 'toogleExpand') {
            this.Extracts.setRestrictionByCode(this.activeRestriction);
            return;
        }

        if (id == undefined) {
            return;
        }

        var splitedResult = id.split("--");
        var code = splitedResult[0];
        var hasChildren = (splitedResult[1] == 'true');

        if (hasChildren && this.activeRestriction != null) {
            this.Extracts.setRestrictionByCode(this.activeRestriction);
        }


        if (!hasChildren && code != null) {
            this.Extracts.setRestrictionByCode(code);
            this.activeRestriction = code;

        }
    }

    collapse(index, id) {
        this.Extracts.setRestrictionByCode(null);

        if (id == null || id == undefined)
            return;

        var splitedResult = id.split("--");
        var code = splitedResult[0];
        var hasChildren = (splitedResult[1] == 'true');

        if (hasChildren != true)
            this.activeRestriction = null;
    }


    restrictionChanged(notify) {
        if (angular.isUndefined(this.$location.search().restriction))
            return;

        this.Extracts.setRestrictionByCode(
            this.$location.search().restriction,
            notify
        );
    }

    isRestrictionActive(code) {
        var restriction = this.Extracts.getRestriction();
        if (restriction) {
            return restriction.code == code;
        }

        return false;
    }

    addExtract(egrid) {
        this.Extracts.add(
            {
                egrid: egrid
            }
        )
    }

    openPDF(egrid) {
        this.Loading.show();

        this.$window.location.href = this.getPDFLink(egrid);
    }

    getPDFLink(egrid) {
        return this.Config.services.oereb + '/extract/reduced/pdf/' + egrid + '?lang=' + this.$translate.use();

    }


    showInList(item) {
        return (!item.complex || item.hasChildren);
    }

    url() {
        return window.location.href;
    }

    copyUrlToClipboard() {
        if (this.copyToClipboard(this.url()))
            this.Notification.success(this.$filter('translate')('notification_copied'));
        else
            this.Notification.error(this.$filter('translate')('notification_notsupported'));
    }

    // http://stackoverflow.com/a/33928558
    copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }
}
