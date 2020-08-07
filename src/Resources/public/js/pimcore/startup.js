pimcore.registerNS("pimcore.plugin.BasilicomFieldTranslatorBundle");

pimcore.plugin.BasilicomFieldTranslatorBundle = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.BasilicomFieldTranslatorBundle";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);
    },

    pimcoreReady: function (params, broker) {
        // alert("BasilicomFieldTranslatorBundle ready!");
    }
});

var BasilicomFieldTranslatorBundlePlugin = new pimcore.plugin.BasilicomFieldTranslatorBundle();
