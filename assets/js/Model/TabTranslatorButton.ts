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
    private localizedFields: any;

    constructor(sourceLanguage: string, targetLanguages: [string], elementReference: any | Ext.panel.IPanel, objectId: number) {
        this.sourceLanguage = sourceLanguage;
        this.targetLanguages = targetLanguages;
        this.elementReference = elementReference;

        const pimcoreObjectReference = pimcore.globalmanager.get('object_' + objectId);
        this.localizedFields = pimcoreObjectReference.edit.dataFields.localizedfields;

        this.languageElements = {};
        if (elementReference === this.localizedFields.component) {
            this.languageElements = {...this.localizedFields.languageElements};
        } else {
            this.localizedFields.referencedFields.forEach((referencedField: any) => {
                if (elementReference === referencedField.component) {
                    this.languageElements = {...referencedField.languageElements};
                }
            });
        }
    }

    addToView() {
        // @ts-ignore
        const submitButton = new Ext.Button({
            text: 'Translate fields from "' + this.sourceLanguage + '"',
            handler: this.onSubmit.bind(this)
        });
        this.elementReference.insert(0, submitButton);
    }

    /**
     * todo
     *      disable button while translating
     *      enable button only if content of element changed
     */
    onSubmit() {
        const languageElements = this.languageElements[this.sourceLanguage];
        const values = ExtJsComponentUtil.getComponentValues(languageElements);

        console.log("vorher", this.localizedFields.data);
        Translator.bulkTranslate(this.sourceLanguage, this.targetLanguages, values, (resultData: { translations: BulkTranslationResult }) => {
            // todo ==> walk over tabs and activate all once...
            // either doLayout() on each tabs of the tabpanel
            //

            /**
             * @todo
             *  walk over tabs and call "doLayout()" on each tabs of the tabpanel
             *  or set "deferredRender" to false for tabpanel!
             */

            Object.keys(resultData.translations).forEach((locale) => {
                const fields = this.languageElements[locale];
                const translations = resultData.translations[locale];

                if (this.localizedFields.data[locale]) {
                    this.localizedFields.data[locale] = {...this.localizedFields.data[locale], ...translations};
                }

                console.log("nachher", this.localizedFields.data);
                ExtJsComponentUtil.setComponentValues(fields, translations);


                // todo ==> the save command does not get the updated data!!! only after rendering the view..
            });
        });
    }
}
