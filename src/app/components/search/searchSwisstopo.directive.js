export function SearchSwisstopoDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/search/search.html',
        controller: SearchSwisstopoController,
        controllerAs: 'search',
        bindToController: true
    };

    return directive;
}

class SearchSwisstopoController {

    constructor($scope, Map, Coordinates) {
        'ngInject';

        this.Map = Map;

        var self = this;

        // Initialize the suggestion engine with swisstopo
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
                // let's remove some unwanted markup in the returned locations
                let returnLocation = location.attrs.label.replace('<b>', '').replace('</b>', '');
                returnLocation =  returnLocation.replace('<i>', '').replace('</i>', '');

                return returnLocation;
            },
            source: placesSource.ttAdapter()
        };

        // watch the home.search model for changes
        $scope.$watch(function () {
            return self.search;
        }, function (value) {
            if (self.search !== null && typeof self.search === 'object') {

                // center result
                var coordinates = Coordinates.set('search', Coordinates.System[4326], [self.search.attrs.lon, self.search.attrs.lat]);

                self.Map.setPosition(coordinates);
                self.Map.click(coordinates);

            }
        });

    }
}