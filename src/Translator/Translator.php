<?php

namespace Basilicom\FieldTranslatorBundle\Translator;

interface Translator
{
    /**
     * @param string $text
     * @param string $targetLanguage
     * @param string $sourceLanguage optional - source language if available, else autodetect should be used
     *
     * @return string
     */
    public function translate(string $text, string $targetLanguage, string $sourceLanguage = ''): string;
}
