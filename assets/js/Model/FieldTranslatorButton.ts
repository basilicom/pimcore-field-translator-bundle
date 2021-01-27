import {Translator} from "./Translator";
import {TranslatorButton} from "./TranslatorButton";

export class FieldTranslatorButton implements TranslatorButton {
    language: string;
    elementReference: any;

    constructor(language: string, elementReference: any) {
        this.language = language;
        this.elementReference = elementReference;
    }

    addToView() {
        if (this.elementReference.bodyEl && this.elementReference.bodyEl.dom) {
            this.elementReference.bodyEl.setStyle('position', 'relative');

            const translateButton = Ext.core.DomHelper.append(this.elementReference.bodyEl.dom, "<a class='basilicom-translator_button'></a>");
            const buttonElement = Ext.get(translateButton);
            if (typeof buttonElement !== "undefined" && typeof buttonElement.addListener !== "undefined") {
                buttonElement.addListener("click", this.onSubmit.bind(this));
            }
        }
    }

    onSubmit(): void {
        const fieldValue = this.elementReference.getValue();
        if (fieldValue.length > 0) {
            Translator.translate(fieldValue, this.language, (resultData: any) => {
                this.elementReference.setValue(resultData.translation);
            });
        }
    }
}
