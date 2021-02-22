import {Translator} from "./Translator";

export class FieldTranslatorButton {
    constructor(private targetLanguage: string) {
    }

    render(target: Ext.IElement) {
        target.setStyle!('position', 'relative');

        let buttonTemplate = `<a class="basilicom-translator_button" title="Translate field content to ${this.targetLanguage}"></a>`;

        const translateButton = Ext.core.DomHelper.append(target.dom, buttonTemplate);
        const buttonElement = Ext.get(translateButton);
        if (typeof buttonElement !== "undefined" && typeof buttonElement.addListener !== "undefined") {
            buttonElement.addListener("click", this.onSubmit.bind(this, target));
        }
    }

    onSubmit(eventTarget: any): void {
        const fieldValue = eventTarget.getValue();
        if (fieldValue.length > 0) {
            Translator.translate(fieldValue, this.targetLanguage, (resultData: any) => {
                eventTarget.setValue(resultData.translation);
            });
        }
    }
}
