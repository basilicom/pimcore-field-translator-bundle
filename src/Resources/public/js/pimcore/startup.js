// todo => create service which requests translations => use it in the tag files
pimcore.registerNS("pimcore.plugin.basilicomTranslator");

pimcore.plugin.basilicomTranslator = Class.create(pimcore.plugin.admin, {
  getClassName: function () {
    return "pimcore.plugin.basilicomTranslator";
  },

  initialize: function () {
    pimcore.plugin.broker.registerPlugin(this);
  }
});

var basilicomTranslatorPlugin = new pimcore.plugin.basilicomTranslator();
