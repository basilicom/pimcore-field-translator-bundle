pimcore.object.tags.localizedfields = Class.create(pimcore.object.tags.localizedfields, {
  getLayoutEdit: function ($super) {
    let panelElement = $super();
    let context = this.context;

    pimcore.object.basilicom.addPanelTranslationButton(panelElement, context);

    return panelElement;
  }
});
