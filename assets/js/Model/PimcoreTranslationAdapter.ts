declare const t: (label: string) => string;

export class PimcoreTranslationAdapter {
    static translate(label: string, payload: { [key: string]: string } = {}) {
        let translation = t(label);
        Object.keys(payload).forEach((key) => {
            translation = translation.replace(key, payload[key]);
        });

        return translation;
    }
}
