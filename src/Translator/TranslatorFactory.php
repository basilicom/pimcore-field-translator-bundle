<?php

namespace Basilicom\FieldTranslatorBundle\Translator;

use Basilicom\FieldTranslatorBundle\DependencyInjection\ConfigDefinition;
use Exception;
use Google\Cloud\Translate\V2\TranslateClient;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpClient\CurlHttpClient;

class TranslatorFactory
{
    public const GOOGLE_TRANSLATE = 'GoogleTranslate';
    public const DEEP_L = 'DeepL';

    private $strategy;

    private $translatorConfig;

    private $logger;

    public function __construct(string $strategy, array $translatorConfig, LoggerInterface $logger)
    {
        $this->strategy = $strategy;
        $this->translatorConfig = $translatorConfig;
        $this->logger = $logger;
    }

    /**
     * @throws Exception
     */
    public function createTranslator(): Translator
    {
        switch ($this->strategy) {
            case self::DEEP_L:
                $httpClient = new CurlHttpClient(
                    [
                        'query' => [
                            'auth_key' => $this->translatorConfig[ConfigDefinition::API_KEY],
                        ],
                    ]
                );

                return new DeepL($httpClient, $this->logger);
            case self::GOOGLE_TRANSLATE:
                $translateClient = new TranslateClient(
                    [
                        'key' => $this->translatorConfig[ConfigDefinition::API_KEY],
                    ]
                );

                return new GoogleTranslate($translateClient);
            default:
                $errorMessage = 'Unsupported strategy ' . $this->strategy . '.';

                $this->logger->error($errorMessage);
                throw new Exception($errorMessage);
        }
    }
}
