import {TabTranslatorButton} from "../../Model/TabTranslatorButton";

declare const pimcore: any;
declare const Class: any;


// option => create new version of dataobject and refresh view
// bekomme ich beim translate die neusten inputs

// todo => add own tab with settings ==> checkbox per language, overwrite filled fields, ...
pimcore.object.tags.localizedfields = Class.create(pimcore.object.tags.localizedfields, {
    getLayoutEdit: function ($super: any) {
        const localizedFieldComponent = $super();
        const context = this.context;

        // todo not so nice...
        const sourceLanguage = [...this.frontendLanguages].shift() ?? "en";

        localizedFieldComponent.on("afterrender", (panel: Ext.IPanel) => {
            pimcore.elementservice.updateObject(2, {"localizedfields":{"en":{"yetAnother":"yet!"},"de":{},"fr":{}}});

            localizedFieldComponent.query('tabpanel').forEach((tabpanel: Ext.ITabPanel) => {
                const tabPanels = tabpanel.items.items as [Ext.IPanel];
                tabPanels.forEach((tabpanel: Ext.ITabPanel) => {
                    const targetLanguage = "de"; // todo

                    // panel.query!('component').forEach((component: any) => {
                    //     console.log(component);
                    // });

                    const translatorButton = new TabTranslatorButton(sourceLanguage, targetLanguage, context.objectId, panel);
                    translatorButton.render(tabpanel);
                });
            });
        });

        return localizedFieldComponent;
    }
});
