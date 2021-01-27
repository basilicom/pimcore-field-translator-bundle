import {FieldTranslatorButton} from "../../Model/FieldTranslatorButton";

declare const pimcore: any;
declare const Class: any;

pimcore.object.tags.input = Class.create(pimcore.object.tags.input, {
    getLayoutEdit: function ($super: any) {
        const panelElement = $super();
        const context = this.context;

        if (context && context.hasOwnProperty("containerType") && context.containerType === "localizedfield") {
            const language = context.language as string;
            panelElement.on("afterrender", function (element: Ext.form.field.IBase) {
                const fieldTranslatorButton = new FieldTranslatorButton(language, element);
                fieldTranslatorButton.addToView();
            });
        }

        return panelElement;
    }
});
