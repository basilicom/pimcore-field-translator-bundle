<?php

namespace Basilicom\FieldTranslatorBundle\Translator;

use Basilicom\FieldTranslatorBundle\DependencyInjection\ConfigDefinition;
use Exception;
use Google\Cloud\Translate\V2\TranslateClient;
use Symfony\Component\HttpClient\CurlHttpClient;

class TranslatorFactory
{
    public const GOOGLE_TRANSLATE = 'GoogleTranslate';
    public const DEEP_L = 'DeepL';

    private $strategy;

    private $translatorConfig;

    public function __construct(string $strategy, array $translatorConfig)
    {
        $this->strategy = $strategy;
        $this->translatorConfig = $translatorConfig;
    }

    /**
     * @throws Exception
     */
    public function createTranslator(): Translator
    {
        switch ($this->strategy) {
            case self::DEEP_L:
                $httpClient = new CurlHttpClient();
                $apiKey = $this->translatorConfig[ConfigDefinition::API_KEY];

                return new DeepL($httpClient, $apiKey);
            case self::GOOGLE_TRANSLATE:
                $translateClient = new TranslateClient(
                    [
                        'key' => $this->translatorConfig[ConfigDefinition::API_KEY],
                    ]
                );

                return new GoogleTranslate($translateClient);
            default:
                $errorMessage = 'Unsupported strategy ' . $this->strategy . '.';

                throw new Exception($errorMessage);
        }
    }
}
