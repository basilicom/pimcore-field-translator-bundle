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
        $languages = (array) $requestData['languages'];

        $payload = [];

        try {
            $status = Response::HTTP_OK;
            foreach ($languages as $language) {
                $payload[$language] = $this->translator->translate($text, $language);
            }
        } catch (Exception $exception) {
            $status = Response::HTTP_BAD_REQUEST;
            $payload = [
                'code' => $exception->getCode(),
                'message' => $exception->getMessage(),
            ];
        }

        return parent::json($payload, $status, ['Content-Type' => 'application/json; charset=utf-8']);
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
