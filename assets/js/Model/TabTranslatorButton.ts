import {Translator} from "./Translator";
import {ExtJsPanelValueExtractor} from "../Util/ExtJsPanelValueExtractor";
import {CKEditorHelper} from "../Util/CKEditorHelper";
import {TranslatorButton} from "./TranslatorButton";

declare const pimcore: any;
declare const Class: any;

export class TabTranslatorButton implements TranslatorButton {
    language: string;
    elementReference: any;
    objectId: string | number;

    constructor(language: string, elementReference: any, objectId: string | number) {
        this.language = language;
        this.elementReference = elementReference;
        this.objectId = objectId;
    }

    addToView() {
        if (this.elementReference.query && this.elementReference.query('tabpanel').length > 0) {
            const tabPanel = (this.elementReference.query('tabpanel') as [Ext.ITabPanel])[0];
            tabPanel.items.items.forEach((tabPanelPanel: any) => {
                // @ts-ignore
                const submitButton = new Ext.Button({
                    text: 'Translate fields',
                    handler: this.onSubmit.bind(this)
                });

                tabPanelPanel.insert(0, submitButton);
            });
        }
    }

    onSubmit() {
        const myObject = pimcore.globalmanager.get('object_' + this.objectId);
        const languageElements = myObject.edit.dataFields.localizedfields.languageElements[this.language];

        const values = ExtJsPanelValueExtractor.getComponentValues(languageElements);
        Translator.bulkTranslate(this.language, values, (resultData: any) => {
            Object.keys(resultData.translations).forEach((fieldId) => {
                let components = Ext.ComponentQuery.query('component#' + fieldId);
                if (components.length > 0) {
                    let component = components[0] as Ext.form.field.IBase;
                    let value = resultData.translations[fieldId] + '!!!';

                    if ((typeof component.setValue !== 'undefined') && component.inputType !== 'password') {
                        component.setValue(value);
                    } else {
                        let ckEditor = CKEditorHelper.getInstance(component.id as string);
                        if (ckEditor) ckEditor.setData(value);
                    }
                }
            });
        });
    }
}
