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
        try {
            $result = $this->translationService->translate($text, ['target' => $targetLanguage]);
        } catch (Exception $exception) {
            throw new Exception('Error requesting API: ' . $exception->getMessage(), $exception->getCode());
        }

        return $result ? $result['text'] : $text;
    }
}
