import {Translator} from "./Translator";
import {ExtJsComponentUtil} from "../Util/ExtJsComponentUtil";

declare const pimcore: any;
declare const Class: any;

type BulkTranslationResult = {
    [fieldId: string]: string;
}

class Button {
    private component: any;

    constructor(private label: string, onSubmit: () => void, private disabledLabel: string = label) {
        this.label = label;
        this.disabledLabel = disabledLabel;
        // @ts-ignore
        this.component = new Ext.Button({text: label, handler: onSubmit});
    }

    enable(): void {
        this.component.enable();
        this.component.setText(this.label);
    }

    disable(): void {
        this.component.disable();
        this.component.setText(this.disabledLabel);
    }

    getComponent(): any {
        return this.component
    }
}

export class TabTranslatorButton {
    private submitButton: Button;

    private elementReference: Ext.IPanel;
    private sourceLanguage: string;
    private targetLanguage: string;
    private languageElements: { [language: string]: any };

    constructor(sourceLanguage: string, targetLanguage: string, objectId: number, elementReference: Ext.IPanel) {
        this.sourceLanguage = sourceLanguage;
        this.targetLanguage = targetLanguage;
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

        this.submitButton = new Button(
            'Translate fields from "' + this.sourceLanguage + '"',
            this.onSubmit.bind(this),
            'Translating tabs ...'
        );
    }

    render(target: Ext.panel.IPanel) {
        target.insert!(0, this.submitButton.getComponent());
    }

    onSubmit() {
        const localizedLanguageElements = this.languageElements[this.sourceLanguage];
        const values = ExtJsComponentUtil.getComponentValues(localizedLanguageElements);

        this.submitButton.disable();
        Translator.bulkTranslate(this.sourceLanguage, this.targetLanguage, values, (resultData: { translations: BulkTranslationResult }) => {
            ExtJsComponentUtil.setComponentValues(this.languageElements[this.targetLanguage], resultData.translations);
            this.submitButton.enable();
        });
    }
}
