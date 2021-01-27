import {Translator} from "./Translator";
import {TranslatorButton} from "./TranslatorButton";

export class FieldTranslatorButton implements TranslatorButton {
    constructor(
        private language: string,
        private elementReference: any | Ext.form.field.IText
    ) {
    }

    addToView() {
        this.elementReference.bodyEl.setStyle('position', 'relative');

        const translateButton = Ext.core.DomHelper.append(this.elementReference.bodyEl.dom, "<a class='basilicom-translator_button'></a>");
        const buttonElement = Ext.get(translateButton);
        if (typeof buttonElement !== "undefined" && typeof buttonElement.addListener !== "undefined") {
            buttonElement.addListener("click", this.onSubmit.bind(this));
        }
    }

    onSubmit(): void {
        const fieldValue = this.elementReference.getValue();
        if (fieldValue.length > 0) {
            Translator.translate(fieldValue, this.language, (resultData: any) => {
                this.setValue(resultData.translation);
            });
        }
    }

    setValue(translation: string) {
        this.elementReference.setValue(translation);
    }
}
