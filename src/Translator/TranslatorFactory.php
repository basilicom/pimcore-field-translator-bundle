<?php

namespace Basilicom\FieldTranslatorBundle\Translator;

use Basilicom\FieldTranslatorBundle\DependencyInjection\ConfigDefinition;
use ErrorException;
use Google\Cloud\Translate\V2\TranslateClient;

class TranslatorFactory
{
    public const GOOGLE_TRANSLATE = 'GoogleTranslate';

    private $strategy;

    private $translatorConfig;

    public function __construct(string $strategy, array $translatorConfig)
    {
        $this->strategy = $strategy;
        $this->translatorConfig = $translatorConfig;
    }

    /**
     * @throws ErrorException
     */
    public function createTranslator(): Translator
    {
        switch ($this->strategy) {
            case self::GOOGLE_TRANSLATE:
                $translateClient = new TranslateClient(
                    [
                        'key' => $this->translatorConfig[ConfigDefinition::API_KEY]
                    ]
                );

                return new GoogleTranslate($translateClient);
            default:
                throw new ErrorException('Unsupported strategy.');
        }
    }
}
