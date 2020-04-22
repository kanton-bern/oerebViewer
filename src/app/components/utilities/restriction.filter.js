function priorityCompare(first, second) {
    let prioFirst = 0;
    if (first.AreaShare) {
        prioFirst = 3
    } else if (first.LengthShare) {
        prioFirst = 2
    } else if (first.NrOfPoints) {
        prioFirst = 1
    }
    let prioSecond = 0;
    if (second.AreaShare) {
        prioSecond = 3
    } else if (second.LengthShare) {
        prioSecond = 2
    } else if (second.NrOfPoints) {
        prioSecond = 1
    }

    return prioFirst - prioSecond;
}

export function RestrictionFilter() {
    'ngInject';

    return function (values) {
        return values.sort((b, a) => {
            return priorityCompare(a, b) ||
                a.AreaShare - b.AreaShare ||
                a.LengthShare - b.LengthShare ||
                a.NrOfPoints - b.NrOfPoints ||
                ('' + b.Information[0].Text).localeCompare('' + a.Information[0].Text);
        });
    }
}
