<?php

namespace Basilicom\FieldTranslatorBundle\Controller;

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
        $headers = ['Content-Type' => 'application/json; charset=utf-8'];
        $status = Response::HTTP_OK;

        $text = $request->get('text');
        $languages = $request->get('languages');

        $payload = [];
        foreach ($languages as $language) {
            $payload[$language] = $this->translator->translate($text, $language);
        }

        return parent::json($payload, $status, $headers);
    }
}
