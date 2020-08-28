pimcore.registerNS("pimcore.object.basilicom.addTranslationButton");
pimcore.object.basilicom.addTranslationButton = function (element, context) {
  element.bodyEl.setStyle('position', 'relative');

  var translateButton = Ext.core.DomHelper.append(element.bodyEl.dom, '<a class="basilicom-translator_button"></a>');
  Ext.get(translateButton).addListener('click', function () {
    var sourceLanguage = ''; // auto detect
    var targetLanguages = [context.language];
    var textToTranslate = element.getValue();

    if (textToTranslate.length > 0) {
      pimcore.object.basilicom.translate(textToTranslate, sourceLanguage, targetLanguages, function (resultData) {
        element.setValue(resultData.texts[targetLanguage]);
      });
    }
  });
};

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
