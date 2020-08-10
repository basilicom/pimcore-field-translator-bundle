pimcore.object.tags.input = Class.create(pimcore.object.tags.input, {
  getLayoutEdit: function ($super) {
    var panelElement = $super();

    panelElement.on("afterrender", function (el) {
      panelElement.bodyEl.setStyle('position', 'relative');

      var translateButton = Ext.core.DomHelper.append(panelElement.bodyEl.dom, '<a class="basilicom-translator_button"></a>');
      Ext.get(translateButton).addListener('click', function (event) {
        var sourceLanguage = 'en'; // @todo maybe get a reference language via select
        var targetLanguages = ['de']; // @todo get context from localized field - can we get a parent form here??
        var textToTranslate = panelElement.getValue();

        if (textToTranslate.length > 0) {
          pimcore.object.basilicom.translate(textToTranslate, sourceLanguage, targetLanguages, function (resultData) {
            var translatedText = resultData.texts[targetLanguage];

            panelElement.setValue(translatedText);
          });
        }
      });
    });

    return panelElement;
  }
});

// @todo wysiwyg => set context and get it from the ckeditor plugin
