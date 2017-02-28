export function LegalListDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/legallist/legallist.html',
        scope: {
            documents: '=',
            title: '=',
            xsitype: '=',
            entryicon: '='
        },
        controller: LegalListController,
        controllerAs: 'list',
        bindToController: true
    };

    return directive;
}

class LegalListController {
    constructor($scope, Extracts) {
        'ngInject';

        var self = this;
        this.$scope = $scope;
        this.hasElement = false;
        this.textList = [];
        
        // fallback update
        Extracts.registerCurrentObserverCallback(function() {
            setTimeout(function() {
                self.newDocumentsList = self.removeDuplicates(self.documents);
            }, 1000);
        });

        self.newDocumentsList = this.removeDuplicates(self.documents);
    }


    removeDuplicates(documents) {
        var self = this;

        var newDocumentsList = [];

        documents.forEach(function (v) {

            v.LegalProvisions.forEach(function (parentDocument) {

                if (angular.isDefined(parentDocument.Reference)) {
                    parentDocument.Reference.forEach(function (document) {
                        if (document['_xsi:type'] != self.xsitype)
                            return;

                        if (self.isInTextList(document))
                            return;

                        self.fillTextList(document);

                        newDocumentsList.push(document);

                    });
                }
                // do the same for parent objects

                // skip documents of other types
                if (parentDocument['_xsi:type'] != self.xsitype)
                    return;

                if (self.isInTextList(parentDocument))
                    return;

                self.fillTextList(parentDocument);

                newDocumentsList.push(parentDocument);
            });
        });

        return newDocumentsList;
    }

    fillTextList(document) {
        // add to textesList, if there is content
        if (document.Title.LocalisedText.Text.length != 0) {
            this.textList.push(document.Title.LocalisedText.Text);
        }

        if (document.OfficialTitle.LocalisedText.Text.length != 0) {
            this.textList.push(document.OfficialTitle.LocalisedText.Text);
        }

        if (document.TextAtWeb.LocalisedText.Text.length != 0) {
            this.textList.push(document.TextAtWeb.LocalisedText.Text);
        }

    }

    isInTextList(document) {
        var result = false;

        if (document.Title.LocalisedText.Text.length != 0) {
            result = this.isStringInTextList(document.Title.LocalisedText.Text);

            if (result)
                return result;
        }

        if (document.OfficialTitle.LocalisedText.Text.length != 0) {
            result = this.isStringInTextList(document.OfficialTitle.LocalisedText.Text);

            if (result)
                return result;
        }

        if (document.TextAtWeb.LocalisedText.Text.length != 0) {
            result = this.isStringInTextList(document.TextAtWeb.LocalisedText.Text);
        }

        return result;
    }

    isStringInTextList(string) {
        return (this.textList.indexOf(string) > -1);
    }
}
