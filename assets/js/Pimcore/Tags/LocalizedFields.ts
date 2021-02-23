import {TabTranslatorButton} from "../../Model/TabTranslatorButton";
import {PimcoreTranslationAdapter} from "../../Model/PimcoreTranslationAdapter";

declare const pimcore: any;
declare const Class: any;

pimcore.object.tags.localizedfields = Class.create(pimcore.object.tags.localizedfields, {
    getTabItem: function ($super: any, ...args: [any]) {
        const sourceLanguage = [...this.frontendLanguages].shift() ?? "en";

        let targetLanguage = "";
        Object.values(args).forEach((arg) => {
            if (arg.language) return targetLanguage = arg.language;
        });

        const self = this;
        const objectId = this.context.objectId;
        const tabItem = $super(...args);
        const currentAfterRenderEvent = tabItem.listeners.afterrender;
        tabItem.listeners.afterrender = function (panel: any) {
            if (targetLanguage !== sourceLanguage) {
                const translatorButton = new TabTranslatorButton(sourceLanguage, targetLanguage, objectId, self);
                translatorButton.render(panel);
            } else {
                const infoText = PimcoreTranslationAdapter.translate("tabTranslatorButton.sourceTabInfo");
                panel.insert!(0, Ext.create("Ext.panel.Panel", {
                    html: `<p class="alert alert-warning basilicom-translator__source-language-info">${infoText}</p>`
                }));
            }

            return currentAfterRenderEvent.apply(this, arguments!);
        }

        return tabItem;
    }
});
