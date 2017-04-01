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

    constructor($scope, Map, Coordinates, $window) {
        'ngInject';

        this.Map = Map;
        this.$window = $window;

        let self = this;


        // Initialize the suggestion engine with mapbox
        let placesSource = new Bloodhound({
            limit: 3,
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: "https://api.mapbox.com/geocoding/v5/mapbox.places/%QUERY.json?country=ch&access_token=pk.eyJ1Ijoibm92dSIsImEiOiJjaXJlb2Y4ZjUwMDBoaWdtMzU1azRoeTl6In0._jcWOL6ukPitI5BVcwOqeQ",
                wildcard: "%QUERY",
                // rateLimitWait: 1000,
                filter: function(response) {

                    let mapped = $.map(response.features, function(city) {
                        return {
                            id:  city.id,
                            name: city.place_name,
                            /*longitude: city.geometry.coordinates[0],
                            latitude: city.geometry.coordinates[1]*/
                            longitude: city.center[0],
                            latitude: city.center[1],
                            type: city.id.substr(0, city.id.indexOf('.'))
                        };
                    });

                    return mapped;
                }
            }
        });


        placesSource.initialize();

        // load places into the typeahead directive
        this.places = {
            displayKey: "name",
            source: placesSource.ttAdapter()
        };

        // watch the search model for changes
        $scope.$watch(function () {
            return self.search;
        }, function (value) {
            if (self.search !== null && typeof self.search === 'object') {
                // center result
                let coordinates = Coordinates.set('search', Coordinates.System[4326], [self.search.longitude, self.search.latitude]);

                self.Map.setPosition(coordinates);

                if (self.search.type == "address")
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
