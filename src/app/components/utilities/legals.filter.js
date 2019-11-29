export function LegalsFilter() {
    'ngInject';

    var equalDocument = function (a, b) {
        return a.TextAtWeb[0].Text === b.TextAtWeb[0].Text &&
            a.Title[0].Text === b.Title[0].Text &&
            a.DocumentType === b.DocumentType;
    };

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
        }).reduce((acc, document) => {
            if (!acc.find(compareDocument => equalDocument(compareDocument, document))) {
               acc.push(document);
            }
            return acc;
        }, []);

        return documents;
    };
}
