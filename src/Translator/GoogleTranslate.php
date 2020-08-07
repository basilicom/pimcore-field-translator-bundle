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
    public function translate(string $text, string $targetLanguage, string $sourceLanguage = ''): string
    {
        $result = $this->translationService->translate($text, ['target' => $targetLanguage]);

        return $result ? $result['text'] : $text;
    }
}
