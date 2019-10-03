export function RestrictionFilter() {
    'ngInject';

    return function (values) {
        return values.sort((b, a) => {
            return a.AreaShare - b.AreaShare || a.LengthShare - b.LengthShare || a.NrOfPoints - b.NrOfPoints || (''+b.Information[0].Text).localeCompare(''+a.Information[0].Text);
        });
    }
}
