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
        $cacheKey = $this->getCacheKey($text, $targetLanguage, $sourceLanguage);
        if ($cachedTranslation = $this->cacheHandler->load($cacheKey)) {
            return 'cached' . (string)$cachedTranslation;
        }

        $translationResult = $this->translator->translate($text, $targetLanguage, $sourceLanguage);

        $this->cacheHandler->save($cacheKey, $translationResult, [], new DateInterval('P7D'));

        return $translationResult;
    }

    public function bulkTranslate(array $texts, string $targetLanguage, string $sourceLanguage = ''): array
    {
//        $cacheKey = md5(json_encode($texts));
//        if ($translationResult = $this->cacheHandler->load($cacheKey)) {
//            return (array)$translationResult;
//        }

        $translationResult = $this->translator->bulkTranslate($texts, $targetLanguage, $sourceLanguage);

//        $this->cacheHandler->save($cacheKey, $translationResult, [], new DateInterval('P7D'));

        return $translationResult;
    }

    /**
     * @param string $text
     * @param string $targetLanguage
     * @param string $sourceLanguage
     *
     * @return string
     */
    private function getCacheKey(string $text, string $targetLanguage, string $sourceLanguage): string
    {
        return md5($text . '_' . $targetLanguage . '_' . $sourceLanguage);
    }
}
