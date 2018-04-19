export function SearchDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/search/search.html',
        controller: SearchController,
        controllerAs: 'search',
        bindToController: true
    };

    return directive;
}

class SearchController {

    constructor($scope, Map, Coordinates, $window) {
        'ngInject';

        this.Map = Map;
        this.$window = $window;

        let self = this;

        // Initialize the suggestion engine with swisstopo
        let placesSource = new Bloodhound({
            limit: 30,
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: 'https://159.144.217.45/?searchText=%QUERY&type=locations',
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
                let coordinates = Coordinates.set('search', Coordinates.System[4326], [self.search.attrs.lon, self.search.attrs.lat]);

                self.Map.setPosition(coordinates);
                self.Map.click(coordinates);

            }
        });

    }

    reset() {
        this.search = '';

        var element = this.$window.document.getElementById('search-me');
        if(element)
            element.focus();
    }
}
