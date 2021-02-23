<?php

namespace Basilicom\FieldTranslatorBundle\Translator;

use Exception;
use Throwable;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class DeepL implements Translator
{
    private $client;
    private $apiKey;

    public function __construct(HttpClientInterface $client, string $apiKey)
    {
        $this->client = $client;
        $this->apiKey = $apiKey;
    }

    /**
     * @inheritDoc
     * @see https://www.deepl.com/docs-api/translating-text/
     *
     * @param string|array $text
     */
    public function translate(string $text, string $targetLanguage, string $sourceLanguage = ''): string
    {
        $translations = $this->requestTranslations([$text], $targetLanguage, $sourceLanguage);

        return (string)$translations[0]['text'];
    }

    public function bulkTranslate(array $texts, string $targetLanguage, string $sourceLanguage = ''): array
    {
        return $this->requestTranslations($texts, $targetLanguage, $sourceLanguage);
    }

    /**
     * @throws Exception
     */
    private function requestTranslations(array $texts, $targetLanguage, string $sourceLanguage): array
    {
        try {
            $response = $this->client->request(
                'POST',
                'https://api.deepl.com/v2/translate',
                [
                    'body' => $this->getRequestBody($texts, $targetLanguage, $sourceLanguage)
                ]
            );
        } catch (Exception $exception) {
        } catch (Throwable $exception) {
        } finally {
            if (isset($exception)) {
                throw new Exception(
                    'Error requesting DeepL-API: ' . $exception->getMessage(),
                    $exception->getCode()
                );
            }
        }

        return $response->toArray()['translations'];
    }

    private function getRequestBody(array $texts, string $targetLanguage, string $sourceLanguage): string
    {
        $payload = [
            'auth_key' => $this->apiKey,
            'target_lang' => strtoupper($targetLanguage)
        ];

        if (!empty($sourceLanguage)) {
            $payload['source_lang'] = strtoupper($sourceLanguage);
        }

        $query = http_build_query($payload);
        $textFields = [];
        foreach ($texts as $translateableText) {
            $textFields[] = http_build_query(['text' => $translateableText]);
        }

        return $query . '&' . implode('&', $textFields);
    }
}
