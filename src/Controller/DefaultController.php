<?php

namespace Basilicom\FieldTranslatorBundle\Controller;

use Exception;
use Basilicom\FieldTranslatorBundle\Translator\Translator;
use Pimcore\Controller\FrontendController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends FrontendController
{
    private $translator;

    public function __construct(Translator $translator)
    {
        $this->translator = $translator;
    }

    /**
     * @Route("/basilicom/field-translator/translate", methods={"POST"})
     */
    public function indexAction(Request $request)
    {
        $requestData = $this->getRequestData($request);
        $text = (string) $requestData['text'];
        $sourceLanguage = (string) $requestData['sourceLanguage'];
        $targetLanguages = (array) $requestData['targetLanguages'];

        try {
            $payload = [
                'status' => Response::HTTP_OK,
                'texts' => [],
            ];

            foreach ($targetLanguages as $targetLanguage) {
                $payload['texts'][$targetLanguage] = $this->translator->translate(
                    $text,
                    $targetLanguage,
                    $sourceLanguage
                );
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
