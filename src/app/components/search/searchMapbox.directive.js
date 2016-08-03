export function SearchMapboxDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/search/search.html',
        controller: SearchMapboxController,
        controllerAs: 'search',
        bindToController: true
    };

    return directive;
}

class SearchMapboxController {

    constructor($scope, Map) {
        'ngInject';

        this.Map = Map;

        var self = this;


        // Initialize the suggestion engine with mapbox
        var placesSource = new Bloodhound({
            limit: 30,
            datumTokenizer: function(datum) {
                return Bloodhound.tokenizers.whitespace(datum.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: "https://api.mapbox.com/geocoding/v5/mapbox.places/%QUERY.json?country=ch&access_token=pk.eyJ1Ijoibm92dSIsImEiOiJjaXJlb2Y4ZjUwMDBoaWdtMzU1azRoeTl6In0._jcWOL6ukPitI5BVcwOqeQ",
                wildcard: "%QUERY",
                // rateLimitWait: 1000,
                filter: function(response) {
                    return $.map(response.features, function(city) {
                        return {
                            name: city.place_name,
                            longitude: city.geometry.coordinates[0],
                            latitude: city.geometry.coordinates[1]
                        }
                    });
                }
            }
        });


        placesSource.initialize();

        // load places into the typeahead directive
        this.places = {
            displayKey: "name",
            source: placesSource.ttAdapter()
        };

        // watch the home.search model for changes
        $scope.$watch(function () {
            return self.search;
        }, function (value) {
            if (self.search !== null && typeof self.search === 'object') {

                // center result
                let coordinates = [self.search.longitude, self.search.latitude];
                let transformed = self.Map.transform(coordinates, true);

                self.Map.setPosition(transformed[0], transformed[1]);
                self.Map.click(transformed);
            }
        });

    }
}