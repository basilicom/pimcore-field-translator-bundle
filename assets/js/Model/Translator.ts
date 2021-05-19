const request = (url: string, payload: any, onSuccess: Function, onDone: Function) => {
    const requestConfig = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    };

    fetch(url, requestConfig)
        .then((response) => {
            return response.json();
        })
        .then((resultData) => {
            if (resultData.status === 200) {
                onSuccess(resultData);
            } else {
                Ext.MessageBox.alert("Error #" + resultData.errorCode, resultData.errorMessage);
            }
        })
        .finally(() => {
            onDone();
        });
}

export class Translator {
    private static translateUrl = "/basilicom/field-translator/translate";
    private static bulkTranslateUrl = "/basilicom/field-translator/bulk-translate";

    static bulkTranslate(
        sourceLanguage: string,
        targetLanguage: string,
        fields: { [key: string]: string; },
        onSuccess: Function,
        onDone: Function = () => {
        }
    ) {
        request(this.bulkTranslateUrl, {sourceLanguage, targetLanguage, fields}, onSuccess, onDone);
    }

    static translate(
        text: string,
        language: string,
        onSuccess: Function,
        onDone: Function = () => {
        }
    ) {
        if (text.length > 0) {
            request(this.translateUrl, {text, language}, onSuccess, onDone);
        }
    }
}
