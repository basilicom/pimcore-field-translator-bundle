<?php

namespace Basilicom\FieldTranslatorBundle\Controller;

use Exception;
use Basilicom\FieldTranslatorBundle\Translator\Translator;
use Pimcore\Controller\FrontendController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends FrontendController
{
    const BULK_TRANSLATION_SEPARATOR = '%%%-%%%';

    private Translator $translator;

    public function __construct(Translator $translator)
    {
        $this->translator = $translator;
    }

    /**
     * @Route("/basilicom/field-translator/translate", methods={"POST"})
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function translate(Request $request)
    {
        $requestData = $this->getRequestData($request);
        $text = (string) $requestData['text'];
        $targetLanguage = (string) $requestData['language'];

        try {
            $translationResult = $this->translator->translate($text, $targetLanguage);

            $payload = [
                'status' => Response::HTTP_OK,
                'translation' => $translationResult
            ];
        } catch (Exception $exception) {
            $payload = [
                'status' => Response::HTTP_BAD_REQUEST,
                'errorCode' => $exception->getMessage(),
                'errorMessage' => $exception->getMessage(),
            ];
        }

        return parent::json($payload, $payload['status'], ['Content-Type' => 'application/json; charset=utf-8']);
    }

    /**
     * @Route("/basilicom/field-translator/bulk-translate", methods={"POST"})
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function bulkTranslate(Request $request)
    {
        $requestData = $this->getRequestData($request);
        $fields = (array) $requestData['fields'];
        $sourceLanguage = (string) $requestData['sourceLanguage'];
        $targetLanguages = (array) $requestData['targetLanguages'];

        try {
            $payload = [
                'status' => Response::HTTP_OK,
                'translations' => [],
            ];

            $fieldKeys = array_keys($fields);
            foreach ($targetLanguages as $targetLanguage) {
//                $translationResult = $this->translator->bulkTranslate(
//                    array_values($fields),
//                    $targetLanguage,
//                    $sourceLanguage
//                );

                $translationResult = unserialize(
                    'a:6:{i:0;a:2:{s:24:"detected_source_language";s:2:"EN";s:4:"text";s:8:"Der Name";}i:1;a:2:{s:24:"detected_source_language";s:2:"EN";s:4:"text";s:15:"Der zweite Name";}i:2;a:2:{s:24:"detected_source_language";s:2:"EN";s:4:"text";s:25:"<p>Eine Beschreibung</p>
";}i:3;a:2:{s:24:"detected_source_language";s:2:"EN";s:4:"text";s:18:"Mit einer Textarea";}i:4;a:2:{s:24:"detected_source_language";s:2:"EN";s:4:"text";s:45:"Und eine weitere, verschachtelte Beschreibung";}i:5;a:2:{s:24:"detected_source_language";s:2:"EN";s:4:"text";s:36:"<p>Sieh mal, ein WYSIWYG-Editor</p>
";}}'
                );

                $fieldTranslations = [];
                foreach ($translationResult as $key => $result) {
                    $fieldTranslations[$fieldKeys[$key]] = (string) $result['text'];
                }

                $payload['translations'][$targetLanguage] = $fieldTranslations;
            }
        } catch (Exception $exception) {
            $payload = [
                'status' => Response::HTTP_BAD_REQUEST,
                'errorCode' => $exception->getMessage(),
                'errorMessage' => $exception->getMessage(),
            ];
        }

        return parent::json($payload, $payload['status'], ['Content-Type' => 'application/json; charset=utf-8']);
    }

    /**
     * @return array
     */
    protected function getRequestData(Request $request)
    {
        $jsonRequestData = json_decode($request->getContent(), true);
        $requestData = $jsonRequestData ? $jsonRequestData : $request->request->all();

        return (array) $requestData;
    }
}
