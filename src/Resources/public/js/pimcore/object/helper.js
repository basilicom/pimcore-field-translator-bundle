pimcore.registerNS("pimcore.object.basilicom.addFieldTranslationButton");
pimcore.object.basilicom.addFieldTranslationButton = function (element, context) {
  element.bodyEl.setStyle('position', 'relative');

  var translateButton = Ext.core.DomHelper.append(element.bodyEl.dom, '<a class="basilicom-translator_button"></a>');
  Ext.get(translateButton).addListener('click', function () {
    var sourceLanguage = ''; // auto detect
    let targetLanguage = context.language;
    var textToTranslate = element.getValue();

    if (textToTranslate.length > 0) {
      pimcore.object.basilicom.translate(textToTranslate, sourceLanguage, [targetLanguage], function (resultData) {
        element.setValue(resultData.texts[targetLanguage]);
      });
    }
  });
};

pimcore.registerNS("pimcore.object.basilicom.addPanelTranslationButton");
pimcore.object.basilicom.addPanelTranslationButton = function (localizedFieldPanel, context) {
  const sourceLanguage = ''; // autodiscover
  const targetLanguage = 'de'; // todo

  const onSubmit = function (tabPanel) {
    let componentValues = {};

    tabPanel.query('component').forEach((component) => {
      if (typeof component.getValue !== "undefined") {
        componentValues[component.id] = component.getValue();
      } else {
        let editorElement = document.querySelector('#' + component.id + ' .cke_editable');
        if (editorElement !== null) {
          componentValues[component.id] = CKEDITOR.instances[editorElement.id].getData();
        }
      }
    });

    pimcore.object.basilicom.bulkTranslate(componentValues, sourceLanguage, [targetLanguage], function (resultData) {
      console.log(resultData);
      // element.setValue(resultData.texts[targetLanguage]);
    });
  }

  var submitButton = new Ext.Button({text: 'Translate fields', handler: onSubmit});
  localizedFieldPanel.on("afterlayout", (element) => {
    let tabPanel = element.query('tabpanel');
    if (tabPanel.length > 0) {
      let activeTabPanel = tabPanel[0].activeTab;

      submitButton.handler = onSubmit.bind(this, activeTabPanel);
      activeTabPanel.insert(0, submitButton);
    }
  });

  return localizedFieldPanel;
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

pimcore.registerNS("pimcore.object.basilicom.bulkTranslate");
pimcore.object.basilicom.bulkTranslate = function (fields, sourceLanguage, targetLanguages, onSuccess) {
  var requestConfig = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'fields': fields,
      'sourceLanguage': sourceLanguage,
      'targetLanguages': targetLanguages
    }),
  };

  fetch('/basilicom/field-translator/bulk-translate', requestConfig)
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
};
