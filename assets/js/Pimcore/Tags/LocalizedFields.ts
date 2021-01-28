import {TabTranslatorButton} from "../../Model/TabTranslatorButton";

declare const pimcore: any;
declare const Class: any;

pimcore.object.tags.localizedfields = Class.create(pimcore.object.tags.localizedfields, {
    getLayoutEdit: function ($super: any) {
        const panelElement = $super();
        const context = this.context;

        panelElement.on("afterrender", (panel: Ext.panel.IPanel) => {
            const targetLanguages = [...this.frontendLanguages] as [string];
            const sourceLanguage = targetLanguages.shift() ?? 'en';

            // todo ==> get all languages - get filled fields of first, active tab / main language
            // todo ==> translate for all available languages
            // todo ==> fill fields by going through tabs
            // todo ==> source language is englisch

            // todo => add own tab with settings ==> checkbox per language, overwrite filled fields, ...

            const translatorButton = new TabTranslatorButton(sourceLanguage, targetLanguages, panel, context.objectId);
            translatorButton.addToView();
        });

        return panelElement;
    }
});
