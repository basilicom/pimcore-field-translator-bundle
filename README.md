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

----------

## Upcoming
* bulk translation of all fields inside a localized fields section
* translation caching to reduce API requests
* menu item to configure provider, API key and source language
* translate-button for WYSIWYG editables
* tool to drag and drop documents/dataObjects and auto translate all

----------

**Author:** Alexander Heidrich (Basilicom GmbH)  
**License:** GPL v3
