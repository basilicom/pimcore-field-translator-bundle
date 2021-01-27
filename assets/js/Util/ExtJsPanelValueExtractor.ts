export class ExtJsPanelValueExtractor {
    static getComponentValues(fields: [any]): { [key: string]: string; } {
        let componentValues = {};
        fields.forEach((component) => {
            if (component.component.inputType !== 'password') {
                componentValues = {
                    ...componentValues,
                    [component.component.id]: component.getValue()
                }
            }
        });

        return componentValues;
    }
}
