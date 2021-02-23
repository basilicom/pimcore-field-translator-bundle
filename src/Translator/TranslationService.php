<?php

namespace Basilicom\FieldTranslatorBundle\Translator;

use DateInterval;
use Pimcore\Cache\Core\CoreHandlerInterface;

class TranslationService
{
    private $translator;
    private $cacheHandler;

    public function __construct(Translator $translator, CoreHandlerInterface $coreCacheHandler)
    {
        $this->translator = $translator;
        $this->cacheHandler = $coreCacheHandler;
    }

    public function translate(string $text, string $targetLanguage, string $sourceLanguage = ''): string
    {
        $cacheKey = $this->getCacheKey($text, $targetLanguage);
        if ($cachedTranslation = $this->cacheHandler->load($cacheKey)) {
            return (string)$cachedTranslation;
        }

        $translationResult = $this->translator->translate($text, $targetLanguage, $sourceLanguage);

        $this->cacheHandler->save($cacheKey, $translationResult, [], new DateInterval('P14D'));

        return $translationResult;
    }

    public function bulkTranslate(array $textsToTranslate, string $targetLanguage, string $sourceLanguage = ''): array
    {
        $cachedTranslations = [];
        $uncachedTranslations = [];
        foreach ($textsToTranslate as $key => $text) {
            $cacheKey = $this->getCacheKey($text, $targetLanguage);
            if ($cachedTranslation = $this->cacheHandler->load($cacheKey)) {
                $cachedTranslations[$key] = (string)$cachedTranslation;
            } else {
                $uncachedTranslations[$key] = $text;
            }
        }

        if (empty($uncachedTranslations)) {
            return $cachedTranslations;
        }

        $translationResult = $this->translator->bulkTranslate($uncachedTranslations, $targetLanguage, $sourceLanguage);
        foreach ($translationResult as $key => $text) {
            $cacheKey = $this->getCacheKey($textsToTranslate[$key], $targetLanguage);
            $this->cacheHandler->save($cacheKey, $text, [], new DateInterval('P14D'));
        }

        return array_merge($translationResult, $cachedTranslations);
    }

    private function getCacheKey(string $text, string $targetLanguage): string
    {
        return md5($text . '_' . $targetLanguage);
    }
}
