<?php

namespace Basilicom\FieldTranslatorBundle\Translator;

use Google\Cloud\Translate\V2\TranslateClient;

class GoogleTranslate implements Translator
{
    private $translationService;

    public function __construct(TranslateClient $translationService)
    {
        $this->translationService = $translationService;
    }

    /**
     * @inheritDoc
     */
    public function translate(string $text, string $targetLocale): string
    {
        return $targetLocale . ' - ' . $text;
//        $result = $this->translationService->translate($text, ['target' => $targetLocale]);
//
//        return $result ? $result['text'] : $text;
    }
}
