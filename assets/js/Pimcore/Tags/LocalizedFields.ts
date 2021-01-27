import {TabTranslatorButton} from "../../Model/TabTranslatorButton";

declare const pimcore: any;
declare const Class: any;

pimcore.object.tags.localizedfields = Class.create(pimcore.object.tags.localizedfields, {
    getLayoutEdit: function ($super: any) {
        const panelElement = $super();
        const context = this.context;

        panelElement.on("afterrender", (panel: Ext.panel.IPanel) => {
            const language = "en"; // todo!

            const translatorButton = new TabTranslatorButton(language, panel, context.objectId);
            translatorButton.addToView();
        });

        return panelElement;
    }
});
