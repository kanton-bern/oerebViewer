export function LegalsFilter() {
    'ngInject';

    return function (values, xsitype) {
        let documents = values.flatMap((value) => {
            let collection = value.LegalProvisions;
            value.LegalProvisions.forEach(legalProvision => {
                if (legalProvision.Reference) {
                    collection = collection.concat(legalProvision.Reference)
                }
            });
            return collection
        }).filter(document => {
            return document.DocumentType === xsitype;
        });

        return documents;
    };
}
