<?php

declare(strict_types=1);

namespace Basilicom\FieldTranslatorBundle\DependencyInjection;

use Basilicom\FieldTranslatorBundle\Translator\DeepL;
use Exception;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class DeepLTest extends TestCase
{
    /**
     * @test
     *
     * @throws Exception
     */
    public function translate()
    {
        // prepare
        $expectedResult = 'Hallo Welt';

        $text = 'Hello world';
        $targetLanguage = 'de';
        $sourceLanguage = 'en';

        // @see https://www.deepl.com/docs-api/translating-text/
        $responseMock = $this->createMock(ResponseInterface::class);
        $responseMock->method('toArray')->willReturn(
            [
                'translations' => [
                    [
                        'detected_source_language' => 'EN',
                        'text' => $expectedResult,
                    ],
                ],
            ]
        );

        $clientMock = $this->createMock(HttpClientInterface::class);
        $clientMock->expects($this->once())
            ->method('request')
            ->with(
                'POST',
                'https://api.deepl.com/v2/translate',
                [
                    'body' => [
                        'text' => $text,
                        'target_lang' => strtoupper($targetLanguage),
                        'source_lang' => strtoupper($sourceLanguage),
                    ],
                ]
            )
            ->willReturn($responseMock);

        $classUnderTest = new DeepL($clientMock);

        // test
        $result = $classUnderTest->translate($text, $targetLanguage, $sourceLanguage);

        // verify
        $this->assertEquals($expectedResult, $result);
    }
    /**
     * @test
     *
     * @throws Exception
     */
    public function translate_failingRequest()
    {
        // prepare

        $text = 'Hello world';
        $targetLanguage = 'de';
        $sourceLanguage = 'en';

        $clientMock = $this->createMock(HttpClientInterface::class);
        $clientMock->expects($this->once())
            ->method('request')
            ->willThrowException(new RuntimeException());

        $classUnderTest = new DeepL($clientMock);

        // test
        $this->expectException(Exception::class);
        $classUnderTest->translate($text, $targetLanguage, $sourceLanguage);

        // verified by setup
    }
}
