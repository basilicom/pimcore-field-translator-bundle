export class CKEditorHelper {
    static getInstance(componentId: string): CKEDITOR.editor | null {
        const editorElement = document.querySelector('#' + componentId + ' .cke_editable');

        return editorElement !== null ? CKEDITOR.instances[editorElement.id] : null;
    }
}
