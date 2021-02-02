import {Translator} from "./Translator";

export class FieldTranslatorButton {
    constructor(private language: string) {
    }

    render(target: Ext.IElement) {
        target.setStyle!('position', 'relative');

        const translateButton = Ext.core.DomHelper.append(target.dom, "<a class='basilicom-translator_button'></a>");
        const buttonElement = Ext.get(translateButton);
        if (typeof buttonElement !== "undefined" && typeof buttonElement.addListener !== "undefined") {
            buttonElement.addListener("click", this.onSubmit.bind(this, target));
        }
    }

    onSubmit(eventTarget: any): void {
        const fieldValue = eventTarget.getValue();
        if (fieldValue.length > 0) {
            Translator.translate(fieldValue, this.language, (resultData: any) => {
                eventTarget.setValue(resultData.translation);
            });
        }
    }
}
