<?php

namespace Basilicom\FieldTranslatorBundle\Translator;

use Exception;
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
     * @see https://googleapis.github.io/google-cloud-php/#/docs/google-cloud/v0.135.0/translate/v2/translateclient
     */
    public function translate(string $text, string $targetLanguage, string $sourceLanguage = ''): string
    {
        try {
            $result = $this->translationService->translate(
                $text,
                [
                    'target' => strtolower($targetLanguage),
                    'source' => strtolower($sourceLanguage)
                ]
            );
        } catch (Exception $exception) {
            throw new Exception('Error requesting API: ' . $exception->getMessage(), $exception->getCode());
        }

        return $result ? $result['text'] : $text;
    }

    public function bulkTranslate(array $texts, string $targetLanguage, string $sourceLanguage = ''): array
    {
        throw new Exception('Not implemented yet.');
    }
}
