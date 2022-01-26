# Basilicom Field Translator Bundle

## Usecase / Summary
The translation bundle will automatically extend Pimcores localized fields.  
In order to translate a field you will get an additional "translate" option when viewing the fields in a dataobject. 

Each translation have to be triggered manually for each language and field. This will be optimized in the near future.
 
----------

## Installation
1. Install the bundle using ``composer require basilicom/pimcore-field-translator-bundle``
2. Execute ``bin/console pimcore:bundle:enable BasilicomFieldTranslatorBundle``

## Configuration
You can configure a translation-strategy like this:
```
basilicom_field_translator:
  strategy: "DeepL" # available GoogleTranslate|DeepL
  config:
    apiKey: "<- the API key->"
```

## Upcoming
* bulk translation of all fields inside a localized fields section
* translation caching to reduce API requests
* menu item to configure provider, API key and source language
* translate-button for WYSIWYG editables  
* tool to drag and drop documents/dataObjects and auto translate all

## Test setup
Run `make setup-pimcore-6` if you want to test the plugin on a *Pimcore 6* installation.  
Run `make setup-pimcore-x` if you want to test the plugin on a *Pimcore X* installation.    

Adapt the `config.yml` to fit your needs and access pimcore at [http://localhost:2000](http://localhost:2000) and login with 
```
Username: admin
Password: admin
```

You will then find the translation logic in any DataObject with localized fields.

----------
**Author:** Alexander Heidrich (Basilicom GmbH)  
**License:** GPL v3
