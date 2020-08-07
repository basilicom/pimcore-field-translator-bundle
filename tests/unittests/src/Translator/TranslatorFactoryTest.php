<?php

declare(strict_types=1);

namespace Basilicom\FieldTranslatorBundle\DependencyInjection;

use Basilicom\FieldTranslatorBundle\Translator\DeepL;
use Basilicom\FieldTranslatorBundle\Translator\GoogleTranslate;
use Basilicom\FieldTranslatorBundle\Translator\TranslatorFactory;
use Exception;
use PHPUnit\Framework\TestCase;

class TranslatorFactoryTest extends TestCase
{
    public function createTranslatorDataProvider(): array
    {
        return [
            [
                TranslatorFactory::DEEP_L,
                [
                    ConfigDefinition::API_KEY => 'deepl-api-key',
                ],
                DeepL::class,
            ],
            [
                TranslatorFactory::GOOGLE_TRANSLATE,
                [
                    ConfigDefinition::API_KEY => 'google-translate-api-key',
                ],
                GoogleTranslate::class,
            ],
        ];
    }

    /**
     * @test
     * @dataProvider createTranslatorDataProvider
     *
     * @param string $strategy
     * @param array  $translatorConfig
     * @param string $expectedClass
     *
     * @throws Exception
     */
    public function createTranslator(string $strategy, array $translatorConfig, string $expectedClass)
    {
        // prepare
        $classUnderTest = new TranslatorFactory($strategy, $translatorConfig);

        // test
        $result = $classUnderTest->createTranslator();

        // verify
        $this->assertInstanceOf($expectedClass, $result);
    }
}
