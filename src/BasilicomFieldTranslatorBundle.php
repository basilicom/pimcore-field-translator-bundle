<?php

namespace Basilicom\FieldTranslatorBundle;

use Pimcore\Extension\Bundle\AbstractPimcoreBundle;

class BasilicomFieldTranslatorBundle extends AbstractPimcoreBundle
{
    public function getJsPaths()
    {
        return [
            '/bundles/basilicomfieldtranslator/js/pimcore/startup.js'
        ];
    }
}