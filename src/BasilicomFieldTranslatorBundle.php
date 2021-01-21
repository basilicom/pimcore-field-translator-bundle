<?php

namespace Basilicom\FieldTranslatorBundle;

use Pimcore\Extension\Bundle\AbstractPimcoreBundle;

class BasilicomFieldTranslatorBundle extends AbstractPimcoreBundle
{
    public function getJsPaths()
    {
        return ['/bundles/basilicomfieldtranslator/pimcore-field-translator.js'];
    }

    public function getCssPaths()
    {
        return ['/bundles/basilicomfieldtranslator/pimcore-field-translator.css'];
    }
}
