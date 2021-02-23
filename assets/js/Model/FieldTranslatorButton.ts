import {Translator} from "./Translator";
import {PimcoreTranslationAdapter} from "./PimcoreTranslationAdapter";

declare const pimcore: any;

export class FieldTranslatorButton {
    constructor(private targetLanguage: string) {
    }

    render(target: Ext.IElement) {
        target.setStyle!("position", "relative");

        const translateButton = Ext.core.DomHelper.append(target.dom, this.getButtonTemplate());
        const buttonElement = Ext.get(translateButton);
        if (typeof buttonElement !== "undefined" && typeof buttonElement.addListener !== "undefined") {
            buttonElement.addListener("click", this.onSubmit.bind(this, target));
        }
    }

    private getButtonTemplate(): string {
        const buttonTooltip = PimcoreTranslationAdapter.translate("fieldTranslatorButton.idle", {
            "%locale": pimcore.available_languages[this.targetLanguage]
        });

        return `<a class="basilicom-translator_button" title="${buttonTooltip}"></a>`;
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
