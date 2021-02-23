// ExtJS
export interface ExtJsButton extends Ext.IButton {
    setDisabled(disabled?: boolean): void;
}

export interface ExtJsTextfield extends Ext.form.field.IText {
    setValue(value?: any): any;

    getValue(): any;
}

export type PimcoreLocalizedField = {
    ckeditor?: CKEDITOR.editor,
    name: string,
    component: any | Ext.form.field.IText
};

// Basilicom
export type BulkTranslationResult = {
    [fieldId: string]: string;
}
