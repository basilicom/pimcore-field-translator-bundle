export interface TranslatorButton {
    language: string;
    elementReference: any;
    addToView(): void;
    onSubmit(): void;
}
