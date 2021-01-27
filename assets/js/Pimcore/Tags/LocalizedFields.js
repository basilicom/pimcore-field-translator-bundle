pimcore.object.tags.localizedfields = Class.create(pimcore.object.tags.localizedfields, {
  getLayoutEdit: function ($super) {
    let panelElement = $super();

    pimcore.object.basilicom.addPanelTranslationButton(panelElement, this.context);

    return panelElement;
  }
});
