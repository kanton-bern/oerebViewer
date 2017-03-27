export function LegalsFilter () {
    'ngInject';

    return function (items, xsitype) {

        let newDocumentsList = [];
        let textList = [];

        let fillTextList = function (document) {
            // add to textesList, if there is content
            if (document.Title.LocalisedText.Text.length != 0) {
                textList.push(document.Title.LocalisedText.Text);
            }

            if (document.OfficialTitle.LocalisedText.Text.length != 0) {
                textList.push(document.OfficialTitle.LocalisedText.Text);
            }

            if (document.TextAtWeb.LocalisedText.Text.length != 0) {
                textList.push(document.TextAtWeb.LocalisedText.Text);
            }
        };

        let isInTextList = function (document) {
            let result = false;

            if (document.Title.LocalisedText.Text.length != 0) {
                result = isStringInTextList(document.Title.LocalisedText.Text);

                if (result)
                    return result;
            }

            if (document.OfficialTitle.LocalisedText.Text.length != 0) {
                result = isStringInTextList(document.OfficialTitle.LocalisedText.Text);

                if (result)
                    return result;
            }

            if (document.TextAtWeb.LocalisedText.Text.length != 0) {
                result = isStringInTextList(document.TextAtWeb.LocalisedText.Text);
            }

            return result;
        };

        let isStringInTextList = function (string) {
            return (textList.indexOf(string) > -1);
        };

        items.forEach(function (v) {

            v.LegalProvisions.forEach(function (parentDocument) {

                if (angular.isDefined(parentDocument.Reference)) {
                    parentDocument.Reference.forEach(function (document) {
                        if (document['_xsi:type'] != xsitype)
                            return;

                        if (isInTextList(document))
                            return;

                        fillTextList(document);

                        newDocumentsList.push(document);

                    });
                }
                // do the same for parent objects

                // skip documents of other types
                if (parentDocument['_xsi:type'] != xsitype)
                    return;

                if (isInTextList(parentDocument))
                    return;

                fillTextList(parentDocument);

                newDocumentsList.push(parentDocument);
            });
        });

        return newDocumentsList;
    };
}
