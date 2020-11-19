# Basilicom Field Translator Bundle

WORK IN PROGRESS

## Usecase / Summary
The translation bundle will automatically extend Pimcores localized fields.  
In order to translate a field you will get an additional "translate" option when viewing the fields in a dataobject. 

Each translation have to be triggered manually for each language and field. This will be optimized in the near future.
 
----------

## Installation
1. Install the bundle using ``composer require basilicom/field-translator-bundle``
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

**Author:** Alexander Heidrich (Basilicom GmbH)  
**License:** GPL v3
