<?php

namespace Basilicom\FieldTranslatorBundle\Translator;

use Pimcore\Cache\Core\CoreHandlerInterface;

class TranslationService
{
    private $translator;

    public function __construct(Translator $translator, CoreHandlerInterface $coreCacheHandler)
    {
        $this->translator = $translator;
    }

    public function translate(string $text, string $targetLanguage, string $sourceLanguage = ''): string
    {
        $translationResult = $this->translator->translate($text, $targetLanguage, $sourceLanguage);

        // todo - add cache

        return $translationResult;
    }

    public function bulkTranslate(array $texts, string $targetLanguage, string $sourceLanguage = ''): array
    {
        $translationResult = $this->translator->bulkTranslate($texts, $targetLanguage, $sourceLanguage);

        // todo - add cache

        return $translationResult;
    }
}
