<?php

namespace Basilicom\FieldTranslatorBundle;

use Pimcore\Extension\Bundle\AbstractPimcoreBundle;

class BasilicomFieldTranslatorBundle extends AbstractPimcoreBundle
{
    public function getJsPaths()
    {
        return [
            '/bundles/basilicomfieldtranslator/js/pimcore/startup.js',
            '/bundles/basilicomfieldtranslator/js/pimcore/object/helper.js',
            '/bundles/basilicomfieldtranslator/js/pimcore/object/tags/input.js',
            '/bundles/basilicomfieldtranslator/js/pimcore/object/tags/textarea.js',
        ];
    }
    public function getCssPaths()
    {
        return [
            '/bundles/basilicomfieldtranslator/css/basilicom-translator.css',
        ];
    }
}
