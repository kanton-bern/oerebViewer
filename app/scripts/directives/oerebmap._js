'use strict';

/**
 * @ngdoc directive
 * @name oerebApp.directive:oerebMap
 * @description
 * # oerebMap
 */
angular.module('oerebApp')
  .directive('oerebMap', function () {
    return {
      template: '<div id="oereb-map" class="oereb-map"></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the oerebMap directive');
          console.log(attrs);
          console.log(element);

          // MAP
          var attributions = [
              new ol.Attribution({
                  html: '<a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">' +
                  '&copy swisstopo / Amtliche Vermessung Schweiz/FL</a>'
              })
          ];

          var resolutions = [
              4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
              1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1
          ];

          var wmsCadastre = new ol.layer.Tile({
              extent: [420000, 30000, 900000, 350000],
              source: new ol.source.TileWMS({
                  url: 'http://wms.geo.admin.ch/',
                  crossOrigin: 'anonymous',
                  attributions: attributions,
                  params: {
                      'LAYERS': 'ch.kantone.cadastralwebmap-farbe',
                      'FORMAT': 'image/png',
                      'TILED': true,
                      'VERSION': '1.1.1'
                  },
                  serverType: 'mapserver'
              })
          });

          var wmtsCadastre = new ol.layer.Tile({
              source: new ol.source.WMTS(({
                  layer: 'ch.kantone.cadastralwebmap-farbe',
                  crossOrigin: 'anonymous',
                  attributions: attributions,
                  url: 'https://wmts10.geo.admin.ch/1.0.0/{Layer}/default/current/21781/{TileMatrix}/{TileCol}/{TileRow}.png',
                  tileGrid: new ol.tilegrid.WMTS({
                      origin: [420000, 350000],
                      resolutions: resolutions,
                      matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                          17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
                  }),
                  requestEncoding: 'REST'
              }))
          });

          var map = new ga.Map({
              target: 'oereb-map',
              layers: [wmsCadastre], // wmtsCadastre | wmsCadastre
              view: new ol.View({
                  resolution: 1.0,
                  center: [502160, 125800]
              })
          });


          // Initialize the location marker
          var marker = $('<div class="marker"></div>');
          var popup = new ol.Overlay({
              positioning:'bottom-center',
              element: marker
          });
          map.addOverlay(popup);


          // Initialize the suggestion engine
          var mySource = new Bloodhound({
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


          // This kicks off the loading and processing of local and prefetch data,
          // the suggestion engine will be useless until it is initialized
          mySource.initialize();

          // Initialize typeahead input
          $('#search').typeahead(null, {
              name: 'locations',
              displayKey: function(location) {
                  return location.attrs.label.replace('<b>', '').replace('</b>', '');
              },
              source: mySource.ttAdapter(),
              templates: {
                  suggestion: function(location) {
                      return '<p>' + location.attrs.label + '</p>' ;
                  }
              }
          });

          var parseExtent = function(stringBox2D) {
              var extent = stringBox2D.replace('BOX(', '').replace(')', '').replace(',', ' ').split(' ');
              return $.map(extent, parseFloat);
          };


          // When a result is selected.
          $('#search').on('typeahead:selected', function(evt, location, suggName) {
              var originZoom = {
                  address: 10,
                  parcel: 10,
                  sn25: 8,
                  feature: 7
              };
              var view = map.getView();
              var origin = location.attrs.origin;
              var extent = [0,0,0,0];
              if(location.attrs.geom_st_box2d) {
                  extent = parseExtent(location.attrs.geom_st_box2d);
              } else if (location.attrs.x && location.attrs.y) {
                  var x = location.attrs.y;
                  var y = location.attrs.x;
                  extent = [x,y,x,y];
              }

              if(originZoom.hasOwnProperty(origin)) {
                  var zoom = originZoom[origin];
                  var center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
                  view.setZoom(zoom);
                  view.setCenter(center);
                  popup.setPosition(center);
              } else {
                  popup.setPosition([0,0]);
                  view.fitExtent(extent, map.getSize());
              }
          });



      }
    };
  });
