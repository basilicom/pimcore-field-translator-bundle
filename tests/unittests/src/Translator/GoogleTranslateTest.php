<?php

declare(strict_types=1);

namespace Basilicom\FieldTranslatorBundle\DependencyInjection;

use Basilicom\FieldTranslatorBundle\Translator\GoogleTranslate;
use Exception;
use Google\Cloud\Translate\V2\TranslateClient;
use PHPUnit\Framework\TestCase;

class GoogleTranslateTest extends TestCase
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

        // @see https://cloud.google.com/translate/docs/basic/translating-text
        // @see https://googleapis.github.io/google-cloud-php/#/docs/google-cloud/v0.135.0/translate/v2/translateclient
        $responseMock = [
            'source' => $sourceLanguage,
            'input' => $text,
            'text' => $expectedResult
        ];

        $clientMock = $this->createMock(TranslateClient::class);
        $clientMock->expects($this->once())
            ->method('translate')
            ->with(
                $text,
                [
                    'target' => $targetLanguage,
                    'source' => $sourceLanguage
                ]
            )
            ->willReturn($responseMock);

        $classUnderTest = new GoogleTranslate($clientMock);

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

        $clientMock = $this->createMock(TranslateClient::class);
        $clientMock->expects($this->once())
            ->method('translate')
            ->willThrowException(new Exception());

        $classUnderTest = new GoogleTranslate($clientMock);

        // test
        $this->expectException(Exception::class);
        $classUnderTest->translate($text, $targetLanguage, $sourceLanguage);

        // verified by setup
    }
}
