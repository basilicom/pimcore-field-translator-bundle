<?php

namespace Basilicom\FieldTranslatorBundle\Translator;

use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class DeepL implements Translator
{
    private $client;

    private $logger;

    public function __construct(HttpClientInterface $client, LoggerInterface $logger)
    {
        $this->client = $client;
        $this->logger = $logger;
    }

    /**
     * @inheritDoc
     * @see https://www.deepl.com/docs-api/translating-text/
     */
    public function translate(string $text, string $targetLanguage, string $sourceLanguage = ''): string
    {
        $payload = [
            'text' => $text,
            'target_lang' => strtoupper($targetLanguage),
        ];

        if (!empty($sourceLanguage)) {
            $payload['source_lang'] = $sourceLanguage;
        }

        try {
            $response = $this->client->request(
                'POST',
                'https://api.deepl.com/v2/translate',
                [
                    'body' => $payload,
                ]
            );

            $text = $response->toArray()['translations'][0]['text']; // @todo make fail-safe
        } catch (Exception $exception) {
            throw new Exception(
                'Error requesting DeepL-API: ' . $exception->getMessage(),
                $exception->getCode()
            );
        }

        return $text;
    }
}
