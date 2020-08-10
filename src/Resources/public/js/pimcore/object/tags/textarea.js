pimcore.object.tags.textarea = Class.create(pimcore.object.tags.textarea, {
  getLayoutEdit: function ($super) {
    var panel = $super();

    panel.on("afterrender", function (el) {
      panel.bodyEl.setStyle('position', 'relative');
      var translateButton = Ext.core.DomHelper.append(panel.bodyEl.dom, '<div class="basilicom-translator_button"></div>');
      Ext.get(translateButton).addListener('click', function (event) {

      });
    });

    return panel;
  }
});

// @todo wysiwyg => set context and get it from the ckeditor plugin
