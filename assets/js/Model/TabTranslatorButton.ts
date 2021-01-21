import {Translator} from "./Translator";
import {ExtJsComponentUtil} from "../Util/ExtJsComponentUtil";
import {PimcoreTranslationAdapter} from "./PimcoreTranslationAdapter";

declare const pimcore: any;

type BulkTranslationResult = {
    [fieldId: string]: string;
}

class Button {
    private component: any;

    constructor(private label: string, onSubmit: () => void, private disabledLabel: string = label) {
        this.label = label;
        this.disabledLabel = disabledLabel;
        // @ts-ignore
        this.component = new Ext.Button({
            text: label,
            style: "margin-bottom: 16px",
            handler: onSubmit
        });
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

const supportedTypes = ["input", "textarea", "wysiwyg"];

export class TabTranslatorButton {
    private submitButton: Button;

    private readonly sourceLanguage: string;
    private readonly targetLanguage: string;
    private localizedField: any;

    constructor(sourceLanguage: string, targetLanguage: string, objectId: number, localizedField: any) {
        this.sourceLanguage = sourceLanguage;
        this.targetLanguage = targetLanguage;
        this.localizedField = localizedField;
        this.submitButton = new Button(
            PimcoreTranslationAdapter.translate("tabTranslatorButton.idle", {
                "%locale": pimcore.available_languages[this.sourceLanguage]
            }),
            this.onSubmit.bind(this),
            PimcoreTranslationAdapter.translate("tabTranslatorButton.pending"),
        );
    }

    render(target: Ext.panel.IPanel) {
        target.insert!(0, this.submitButton.getComponent());
    }

    onSubmit() {
        let values: { [key: string]: string } = {};
        this.localizedField.languageElements[this.sourceLanguage].forEach((field: any) => {
            if (supportedTypes.includes(field.fieldConfig.fieldtype) && field.getValue().length > 0) {
                values[field.name] = field.getValue();
            }
        });

        let components = this.localizedField.languageElements[this.targetLanguage].filter((component: any) => {
            return supportedTypes.includes(component.fieldConfig.fieldtype);
        });

        this.submitButton.disable();
        Translator.bulkTranslate(
            this.sourceLanguage,
            this.targetLanguage,
            values,
            (resultData: { translations: BulkTranslationResult }) => {
                ExtJsComponentUtil.setComponentValues(components, resultData.translations);
            },
            () => {
                this.submitButton.enable();
            }
        );
    }
}
