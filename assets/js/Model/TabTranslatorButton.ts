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
    private languageElements: { [language: string]: any };

    constructor(sourceLanguage: string, targetLanguages: [string], elementReference: any | Ext.panel.IPanel, objectId: number) {
        this.sourceLanguage = sourceLanguage;
        this.targetLanguages = targetLanguages;
        this.elementReference = elementReference;

        const pimcoreObjectReference = pimcore.globalmanager.get('object_' + objectId);
        const localizedFields = pimcoreObjectReference.edit.dataFields.localizedfields;

        this.languageElements = {};
        if (elementReference === localizedFields.component) {
            this.languageElements = {...localizedFields.languageElements};
        } else {
            localizedFields.referencedFields.forEach((referencedField: any) => {
                if (elementReference === referencedField.component) {
                    this.languageElements = {...referencedField.languageElements};
                }
            });
        }
    }

    addToView() {
        // @ts-ignore
        const submitButton = new Ext.Button({text: 'Translate fields', handler: this.onSubmit.bind(this)});
        this.elementReference.insert(0, submitButton);
    }

    onSubmit() {
        /**
         * todo
         *      handle multiple localized fields
         *
         * todo
         *      Go through tabs
         *      Gather fields
         *      Call translation
         *      Timeout 500 seconds
         *
         * todo
         *      translatable values should be always compared to avoid duplicated translations and lower the DeepL usage ==> cache
         */
        const languageElements = this.languageElements[this.sourceLanguage];
        const values = ExtJsComponentUtil.getComponentValues(languageElements);
        Translator.bulkTranslate(this.sourceLanguage, this.targetLanguages, values, (resultData: { translations: BulkTranslationResult }) => {
            this.setValues(resultData.translations);
        });
    }

    setValues(translations: BulkTranslationResult) {
        Object.keys(translations).forEach((languageId) => {
            const languageElements = this.languageElements[languageId];
            ExtJsComponentUtil.setComponentValues(languageElements, translations[languageId]);
        });
    }
}
