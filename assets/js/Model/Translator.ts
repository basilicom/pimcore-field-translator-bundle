export class Translator {
    private static translateUrl = "/basilicom/field-translator/translate";
    private static bulkTranslateUrl = "/basilicom/field-translator/bulk-translate";

    static bulkTranslate(language: string, fields: { [key: string]: string; }, onSuccess: Function) {
        const requestConfig = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({fields, language}),
        };

        fetch(this.bulkTranslateUrl, requestConfig)
            .then((response) => {
                return response.json();
            })
            .then((resultData) => {
                if (resultData.status === 200) {
                    onSuccess(resultData);
                } else {
                    Ext.MessageBox.alert("Error #" + resultData.errorCode, resultData.errorMessage);
                }
            });
    }

    static translate(text: string, language: string, onSuccess: Function) {
        if (text.length > 0) {
            var requestConfig = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({text, language}),
            };

            fetch(this.translateUrl, requestConfig)
                .then((response) => {
                    return response.json();
                })
                .then((resultData) => {
                    if (resultData.status === 200) {
                        onSuccess(resultData);
                    } else {
                        Ext.MessageBox.alert("Error #" + resultData.errorCode, resultData.errorMessage);
                    }
                });
        }
    }
}
