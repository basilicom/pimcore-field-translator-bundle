import {TabTranslatorButton} from "../../Model/TabTranslatorButton";

declare const pimcore: any;
declare const Class: any;

pimcore.object.tags.localizedfields = Class.create(pimcore.object.tags.localizedfields, {
    getTabItem: function ($super: any, ...args: [any]) {
        const self = this;

        const tabItem = $super(...args);
        const objectId = this.context.objectId;

        const sourceLanguage = [...this.frontendLanguages].shift() ?? "en";

        let targetLanguage = "";
        Object.values(args).forEach((arg) => {
            if (arg.language) return targetLanguage = arg.language;
        });

        if (targetLanguage !== sourceLanguage) {
            let currentAfterRenderEvent = tabItem.listeners.afterrender;
            tabItem.listeners.afterrender = function (panel: any) {
                const translatorButton = new TabTranslatorButton(sourceLanguage, targetLanguage, objectId, self);
                translatorButton.render(panel);

                return currentAfterRenderEvent.apply(this, arguments!);
            }
        }

        return tabItem;
    }
});
