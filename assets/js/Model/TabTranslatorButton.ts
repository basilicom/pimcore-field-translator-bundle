import {Translator} from "./Translator";
import {ExtJsComponentUtil} from "../Util/ExtJsComponentUtil";
import {TranslatorButton} from "./TranslatorButton";

declare const pimcore: any;
declare const Class: any;

type BulkTranslationResult = {
    [languageId: string]: {
        [fieldId: string]: string;
    }
}

export class TabTranslatorButton implements TranslatorButton {
    private sourceLanguage: string;
    private targetLanguages: [string];
    private elementReference: any | Ext.panel.IPanel;
    private localizedFields: { [language: string]: any };

    constructor(sourceLanguage: string, targetLanguages: [string], elementReference: any | Ext.panel.IPanel, objectId: number) {
        this.sourceLanguage = sourceLanguage;
        this.targetLanguages = targetLanguages;
        this.elementReference = elementReference;

        const pimcoreObjectReference = pimcore.globalmanager.get('object_' + objectId);
        this.localizedFields = pimcoreObjectReference.edit.dataFields.localizedfields.languageElements;
    }

    addToView() {
        if (this.elementReference.query('tabpanel').length > 0) {
            // @ts-ignore
            const submitButton = new Ext.Button({text: 'Translate fields', handler: this.onSubmit.bind(this)});
            this.elementReference.insert(0, submitButton);
        }
    }

    onSubmit() {
        const languageElements = this.localizedFields[this.sourceLanguage];

        /**
         * todo
         *      Go through tabs
         *      Gather fields
         *      Call translation
         *      Timeout 500 seconds
         */

        const values = ExtJsComponentUtil.getComponentValues(languageElements);
        Translator.bulkTranslate(this.sourceLanguage, this.targetLanguages, values, (resultData: { translations: BulkTranslationResult }) => {
            this.setValues(resultData.translations);
        });
    }

    setValues(translations: BulkTranslationResult) {
        Object.keys(translations).forEach((languageId) => {
            const languageElements = this.localizedFields[languageId];
            ExtJsComponentUtil.setComponentValues(languageElements, translations[languageId]);
        });
    }
}
