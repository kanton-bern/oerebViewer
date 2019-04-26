export class DetailController {
    constructor($log, $translate, $window, Config, Extracts, Helpers, Map, Layers, $stateParams, $location, $scope, $rootScope, Coordinates, Loading, Notification, $filter) {
        'ngInject';

        // declarations
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
        this.noDatas = parseInt($stateParams.egrid) === 0;

        // triggers restriction changed at startup
        this.restrictionChanged(false);

        $scope.$on('$locationChangeSuccess', () => {
            this.restrictionChanged(true);
        });

        // on restriction reload add layer to map
        this.Extracts.registerRestrictionObserverCallback(() => {
            this.tempLayers = [];

            const unique = (function () {
                const tempLayerHash = [];
                return function (source) {
                    const hash = source.getUrls().join();
                    if (tempLayerHash.indexOf(hash) === -1) {
                        tempLayerHash.push(hash);
                        return {
                            then: callback => callback()
                        }
                    }
                    return {
                        then: callback => {} // noop
                    }
                }
            })();

            let bbox = '';

            if (angular.isDefined(this.Extracts.getRestriction()))
                angular.forEach(this.Extracts.getRestriction().values, (v) => {
                    bbox = Helpers.getParameterByName('bbox', v.Map.ReferencerWMS);

                    let indexOfWMSServer = v.Map.ReferenceWMS.indexOf('WMSServer?');
                    let wmsTempSource;

                    if (indexOfWMSServer === -1) {
                        wmsTempSource = new this.Map.ol.source.TileWMS(({
                            url: v.Map.ReferenceWMS,
                            params: {
                                'TILED': true,
                            },
                            serverType: 'geoserver'
                        }));
                    }
                    else {
                        let url = v.Map.ReferenceWMS.substr(0, indexOfWMSServer) + 'WMSServer?';

                        wmsTempSource = new this.Map.ol.source.TileWMS(({
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

                    let layer = new this.Map.ol.layer.Tile({
                        /*preload: Infinity,*/
                        opacity: this.Config.opacityRestrictionLayers,
                        visible: true,
                        source: wmsTempSource,
                        name: 'restriction-temp'
                    });

                    layer.setZIndex(50);

                    unique(wmsTempSource)
                      .then(() => {
                          this.tempLayers.push(layer);
                      });
                });

            this.Map.addTempLayers(this.tempLayers);
        });

        if (!this.noDatas) {
            this.Extracts.add($stateParams.egrid);
        }

        // open detail menu on load
        Extracts.registerCurrentObserverCallback(() => {
            Helpers.openMenu();
        });

        // Menubutton in header will change to cross [x] if menu is open.
        let $panel = angular.element('#menuLeftSlider');

        if ($panel.attr('aria-expanded') === 'true') {
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

        let splitedResult = id.split("--");
        let code = splitedResult[0];
        let hasChildren = (splitedResult[1] == 'true');

        if (hasChildren && this.activeRestriction != null) {
            this.Extracts.setRestrictionByCode(this.activeRestriction);
        }


        if (!hasChildren && code != null) {
            this.Extracts.setRestrictionByCode(code);
            this.activeRestriction = code;

        }
    }

    getExternURL(egrid) {
        let url = this.Config.services.extern;

        url = url.replace(/-EGRID-/g, egrid);
        url = url.replace(/-LANGUAGE-/g, this.$filter('translate')('languageISO').toUpperCase());

        return url;
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
        if (this.copyToClipboard(this.url())) {
            this.Notification.success(this.$filter('translate')('notification_copied'));
        } else {
            window.prompt(this.$filter('translate')('prompt_copy'), this.url());
        }
    }

    // http://stackoverflow.com/a/33928558
    copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            let textarea = document.createElement("textarea");
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
