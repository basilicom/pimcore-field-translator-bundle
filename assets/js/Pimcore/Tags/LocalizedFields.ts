import {TabTranslatorButton} from "../../Model/TabTranslatorButton";

declare const pimcore: any;
declare const Class: any;

// todo => add own tab with settings ==> checkbox per language, overwrite filled fields, ...
pimcore.object.tags.localizedfields = Class.create(pimcore.object.tags.localizedfields, {
    getLayoutEdit: function ($super: any) {
        const panelElement = $super();
        const context = this.context;

        const targetLanguages = [...this.frontendLanguages] as [string];
        const sourceLanguage = targetLanguages.shift() ?? "en";

        const translatorButton = new TabTranslatorButton(sourceLanguage, targetLanguages, panelElement, context.objectId);
        translatorButton.addToView();

        return panelElement;
    }
});
