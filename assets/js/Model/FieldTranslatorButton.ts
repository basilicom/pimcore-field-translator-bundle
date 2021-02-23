import {Translator} from "./Translator";
import {ExtJsButton, ExtJsTextfield} from "../definitions";

export class FieldTranslatorButton {
    private targetLanguage: string = "";
    private lastTranslatedValue: string = "";
    private lastTranslation: string = "";
    private button?: ExtJsButton;

    constructor(targetLanguage: string) {
        this.targetLanguage = targetLanguage;
    }

    render(field: ExtJsTextfield) {
        if (!field.bodyEl) {
            return;
        }
        const element = field.bodyEl;
        element.setStyle!("position", "relative");

        this.button = Ext.create("Ext.Button", {
            text: "",
            baseCls: "basilicom-translator__field-button",
            renderTo: element.dom,
            handler: () => {
                this.onSubmit(field);
            }
        });

        field.on!("change", (eventTarget: any) => {
            if (this.button) this.button.setDisabled(!this.hasValueChanged(field));
        });
    }

    private onSubmit(field: ExtJsTextfield): void {
        const fieldValue = field.getValue();
        if (this.hasValueChanged(field)) {
            if (this.button) this.button.setDisabled(true);

            Translator.translate(
                fieldValue,
                this.targetLanguage,
                (resultData: any) => {
                    this.lastTranslatedValue = fieldValue;
                    this.lastTranslation = resultData.translation;
                    field.setValue(resultData.translation);
                },
                () => {
                    if (this.button) this.button.setDisabled(true);
                }
            );
        }
    }

    private hasValueChanged(field: ExtJsTextfield): boolean {
        const currentValue = field.getValue();
        return currentValue.length > 0
            && currentValue !== this.lastTranslatedValue
            && currentValue !== this.lastTranslation
    }
}
