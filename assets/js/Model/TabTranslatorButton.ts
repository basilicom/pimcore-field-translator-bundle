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

export class TabTranslatorButton implements TranslatorButton {
    private submitButton: Button;

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

        this.submitButton = new Button(
            'Translate fields from "' + this.sourceLanguage + '"',
            this.onSubmit.bind(this),
            'Translating tabs ...'
        );
    }

    /**
     * @todo this could be a decorator
     */
    addToView() {
        console.log(this.elementReference);

        this.elementReference.insert(0, this.submitButton.getComponent());
    }

    onSubmit() {
        const localizedLanguageElements = this.languageElements[this.sourceLanguage];
        const values = ExtJsComponentUtil.getComponentValues(localizedLanguageElements);

        this.submitButton.disable();
        Translator.bulkTranslate(this.sourceLanguage, this.targetLanguages, values, (resultData: { translations: BulkTranslationResult }) => {
            this.setValues(resultData.translations, () => {
                this.submitButton.enable();
            });
        });
    }

    // todo - this is ugly!
    setValues(translations: BulkTranslationResult, onDone: Function): void {
        const tabPanel = this.elementReference.query!('tabpanel')[0] as any;
        const tabs = tabPanel.items.items;

        tabs.forEach((item: any, key: any) => {
            window.setTimeout(() => {
                tabPanel.setActiveTab(key);

                // todo => this is not super fail safe :/
                const locale = Object.keys(this.languageElements)[key];
                if (locale !== this.sourceLanguage && translations[locale]) {
                    ExtJsComponentUtil.setComponentValues(this.languageElements[locale], translations[locale]);
                }
            }, 500 * key);

            window.setTimeout(() => onDone(), 500 * tabs.length);
        });
    }
}
