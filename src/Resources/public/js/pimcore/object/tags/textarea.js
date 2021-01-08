// todo => disable button if input is empty
// todo => disable button if value changed by ajax response and not changed
pimcore.object.tags.textarea = Class.create(pimcore.object.tags.textarea, {
  getLayoutEdit: function ($super) {
    var panelElement = $super();
    var context = this.context;

    if (context && context.hasOwnProperty('containerType') && context.containerType === 'localizedfield') {
      panelElement.on("afterrender", function (element) {
        pimcore.object.basilicom.addTranslationButton(element, context)
      });
    }

    return panelElement;
  }
});
