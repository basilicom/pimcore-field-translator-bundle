const forceFieldOverwrite = false; // make configurable

type PimcoreLocalizedField = {
    ckeditor?: CKEDITOR.editor,
    name: string,
    component: any | Ext.form.field.IText
};

export class ExtJsComponentUtil {
    static setComponentValues(fields: [PimcoreLocalizedField], translations: { [key: string]: string; }): void {
        Object.keys(translations).forEach((fieldId) => {
            fields.forEach((field) => {
                if (fieldId === field.name) this.setValue(field, translations[fieldId]);
            });
        });
    }

    private static setValue(field: PimcoreLocalizedField, translation: string) {
        const component = field.component;
        const ckeditor = field.ckeditor;

        if (typeof ckeditor === "undefined") {
            if (forceFieldOverwrite || (!forceFieldOverwrite && component.getValue().toString().length === 0)) {
                component.setValue(translation);
            }
        } else {
            if (forceFieldOverwrite || (!forceFieldOverwrite && ckeditor.getData().toString().length === 0)) {
                ckeditor.setData(translation);
            }
        }
    }
}
