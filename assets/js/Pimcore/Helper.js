// Field Translator
pimcore.registerNS('pimcore.object.basilicom.addFieldTranslationButton');
pimcore.object.basilicom.addFieldTranslationButton = (element, context) => {
  element.bodyEl.setStyle('position', 'relative');

  var translateButton = Ext.core.DomHelper.append(element.bodyEl.dom, '<a class="basilicom-translator_button"></a>');
  Ext.get(translateButton).addListener('click', () => {
    let targetLanguage = context.language;
    var textToTranslate = element.getValue();

    if (textToTranslate.length > 0) {
      pimcore.object.basilicom.translate(textToTranslate, targetLanguage, (resultData) => {
        element.setValue(resultData.translation);
      });
    }
  });
};

// Translate
pimcore.registerNS('pimcore.object.basilicom.translate');
pimcore.object.basilicom.translate = (textToTranslate, language, onSuccess) => {
  if (textToTranslate.length > 0) {
    var requestConfig = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'text': textToTranslate,
        'language': language
      }),
    };

    fetch('/basilicom/field-translator/translate', requestConfig)
      .then((response) => {
        return response.json();
      })
      .then((resultData) => {
        if (resultData.status === 200) {
          onSuccess(resultData);
        } else {
          Ext.MessageBox.alert('Error #' + resultData.errorCode, resultData.errorMessage);
        }
      });
  }
};

// Tab Translator
pimcore.registerNS('pimcore.object.basilicom.addPanelTranslationButton');
pimcore.object.basilicom.addPanelTranslationButton = (localizedFieldPanel, context) => {
  const getCkEditorInstance = (componentId) => {
    let editorElement = document.querySelector('#' + componentId + ' .cke_editable');
    if (editorElement !== null) {
      return CKEDITOR.instances[editorElement.id];
    }

    return null;
  }

  const getComponentValues = (fields) => {
    let componentValues = {};
    fields.forEach((component) => {
      if (component.component.inputType !== 'password') {
        componentValues[component.component.id] = component.getValue();
      }
    });

    return componentValues;
  }

  const targetLanguage = 'en'; // todo ==> maybe get input ids and check
  const onSubmit = (tabPanel) => {
    let myObject = pimcore.globalmanager.get('object_' + context.objectId);
    let values = getComponentValues(myObject.edit.dataFields.localizedfields.languageElements[targetLanguage]);
    pimcore.object.basilicom.bulkTranslate(values, targetLanguage, (resultData) => {
      Object.keys(resultData.translations).forEach((fieldId) => {
        let components = Ext.ComponentQuery.query('component#' + fieldId);
        if (components.length > 0) {
          let component = components[0];
          let value = resultData.translations[fieldId];

          if ((typeof component.setValue !== 'undefined') && component.inputType !== 'password') {
            component.setValue(value);
          } else {
            let ckEditor = getCkEditorInstance(component.id);
            if (ckEditor) ckEditor.setData(value);
          }
        }
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

// Bulk Translate
pimcore.registerNS('pimcore.object.basilicom.bulkTranslate');
pimcore.object.basilicom.bulkTranslate = (fields, language, onSuccess) => {
  var requestConfig = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'fields': fields,
      'language': language
    }),
  };

  fetch('/basilicom/field-translator/bulk-translate', requestConfig)
    .then((response) => {
      return response.json();
    })
    .then((resultData) => {
      if (resultData.status === 200) {
        onSuccess(resultData);
      } else {
        Ext.MessageBox.alert('Error #' + resultData.errorCode, resultData.errorMessage);
      }
    });
};
