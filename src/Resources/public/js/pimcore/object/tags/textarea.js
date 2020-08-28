pimcore.object.tags.textarea = Class.create(pimcore.object.tags.textarea, {
  getLayoutEdit: function ($super) {
    var panelElement = $super();
    var context = this.context;

    if (context.containerType === 'localizedfield') {
      panelElement.on("afterrender", function (element) {
        pimcore.object.basilicom.addTranslationButton(element, context)
      });
    }

    return panelElement;
  }
});

// @todo wysiwyg => set context and get it from the ckeditor plugin
