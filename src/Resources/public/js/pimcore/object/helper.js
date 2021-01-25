pimcore.registerNS('pimcore.object.basilicom.addFieldTranslationButton');
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

pimcore.registerNS('pimcore.object.basilicom.addPanelTranslationButton');
pimcore.object.basilicom.addPanelTranslationButton = function (localizedFieldPanel, context) {
  const sourceLanguage = ''; // autodiscover
  const targetLanguage = 'de'; // todo

  function getCkEditorInstance(componentId) {
    let editorElement = document.querySelector('#' + componentId + ' .cke_editable');
    if (editorElement !== null) {
      return CKEDITOR.instances[editorElement.id];
    }

    return null;
  }

  function getComponentValues(localizedField) {
    let componentValues = {};

    Object.keys(localizedField.languageElements).forEach((language) => {
      componentValues[language] = {};
      localizedField.languageElements[language].forEach((component) => {
        if (component.component.inputType !== 'password') {
          componentValues[language][component.component.id] = component.getValue();
        }
      });
    });

    return componentValues;
  }

  const onSubmit = function (tabPanel) {
    let objectId = context.objectId;
    let myObject = pimcore.globalmanager.get('object_' + objectId);
    pimcore.object.basilicom.bulkTranslate(getComponentValues(myObject.edit.dataFields.localizedfields), sourceLanguage, [targetLanguage], function (resultData) {
      Object.keys(resultData.fields).forEach((language) => {
        Object.keys(resultData.fields[language]).forEach(function (fieldId) {
          let components = Ext.ComponentQuery.query('component#' + fieldId);
          if (components.length > 0) {
            let component = components[0];
            let value = resultData.fields[language][fieldId];

            if ((typeof component.setValue !== 'undefined') && component.inputType !== 'password') {
              component.setValue(value);
            } else {
              let ckEditor = getCkEditorInstance(component.id);
              if (ckEditor) ckEditor.setData(value);
            }
          }
        });
      });
    });
  }

  var submitButton = new Ext.Button({text: 'Translate fields', handler: onSubmit});
  localizedFieldPanel.on('afterlayout', function (element) {
    let tabPanel = element.query('tabpanel');
    // todo ==> get active locale
    if (tabPanel.length > 0) {
      let activeTabPanel = tabPanel[0].activeTab;

      submitButton.handler = onSubmit.bind(this, activeTabPanel);
      activeTabPanel.insert(0, submitButton);
    }
  });

  return localizedFieldPanel;
};

pimcore.registerNS('pimcore.object.basilicom.translate');
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

pimcore.registerNS('pimcore.object.basilicom.bulkTranslate');
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
