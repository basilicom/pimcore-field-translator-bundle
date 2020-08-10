pimcore.registerNS("pimcore.object.basilicom.translate");
pimcore.object.basilicom.translate = function (textToTranslate, sourceLanguage, targetLanguages, onSuccess) {
  if (textToTranslate.length > 0) {
    var requestConfig = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'text': textToTranslate,
        'sourceLanguage': sourceLanguage,
        'targetLanguages': targetLanguages
      }),
    };

    fetch('/basilicom/field-translator/translate', requestConfig)
      .then(function (response) {
        return response.json();
      })
      .then(function (resultData) {
        if (resultData.status === 200) {
          onSuccess(resultData);
        } else {
          Ext.MessageBox.alert('Error #' + resultData.errorCode, resultData.errorMessage);
        }
      });
  }
};
