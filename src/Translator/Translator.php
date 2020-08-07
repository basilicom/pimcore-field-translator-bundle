<?php

namespace Basilicom\FieldTranslatorBundle\Translator;

interface Translator
{
    /**
     * @param string      $text
     * @param string      $targetLocale
     *
     * @return string
     */
    public function translate(string $text, string $targetLocale): string;
}
