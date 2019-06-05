export function LegalsFilter () {
    'ngInject';

    return function (values, xsitype) {
        let documents = values.flatMap((value) => {
            return value.LegalProvisions;
        }).filter(document => {
            return document.DocumentType === xsitype;
        });

        return documents;
    };
}
