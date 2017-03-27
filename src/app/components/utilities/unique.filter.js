export function UniqueFilter () {
    'ngInject';

    return function (items, filterOn) {

        if (angular.isUndefined(filterOn) || filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            let hashCheck = {}, newItems = [];

            let objectByString = function(o, s) {
                // convert indexes to properties
                s = s.replace(/\[(\w+)\]/g, '.$1');
                // strip a leading dot
                s = s.replace(/^\./, '');

                let a = s.split('.');
                for (let i = 0, n = a.length; i < n; ++i) {
                    let k = a[i];
                    if (k in o) {
                        o = o[k];
                    } else {
                        return;
                    }
                }
                return o;
            };

            let extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return objectByString(item, filterOn);
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                let valueToCheck, isDuplicate = false;

                for (let i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
}
