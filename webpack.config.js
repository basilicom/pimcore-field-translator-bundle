const Encore = require('@symfony/webpack-encore')

Encore
    .setOutputPath('src/Resources/public')
    .setPublicPath('/bundles/basilicomfieldtranslator')
    .setManifestKeyPrefix('bundles/basilicomfieldtranslator')
    .configureBabel((babelConfig) => {
      babelConfig.plugins.push('@babel/plugin-transform-spread')
      babelConfig.plugins.push('@babel/plugin-transform-template-literals')
      babelConfig.plugins.push('@babel/plugin-transform-arrow-functions')
      babelConfig.plugins.push('@babel/plugin-transform-parameters')
    }, {
      useBuiltIns: 'usage',
      corejs: 3,
    })

    .enableTypeScriptLoader()
    .disableSingleRuntimeChunk()

    .addEntry(
        'pimcore-field-translator',
        './assets/js/pimcore-field-translator.ts',
    )

    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(false)

    .enableSassLoader()
    .enablePostCssLoader((options) => {
      options.postcssOptions = options.postcssOptions || {}
      options.postcssOptions.plugins = [require('autoprefixer')()]
    })

    .configureTerserPlugin((options) => {
      options.terserOptions = {
        ...options.terserOptions,
        mangle: {
          reserved: ['$super'],
        },
      }
    })

    .copyFiles({ from: './assets/img/', to: 'img/[name].[ext]' })

module.exports = Encore.getWebpackConfig()
