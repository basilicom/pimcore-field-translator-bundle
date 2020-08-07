<?php

declare(strict_types=1);

namespace Basilicom\FieldTranslatorBundle\DependencyInjection;

use Basilicom\FieldTranslatorBundle\Translator\TranslatorFactory;
use PHPUnit\Framework\TestCase;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Yaml\Yaml;

class BasilicomFieldTranslatorExtensionTest extends TestCase
{
    /**
     * @test
     */
    public function load(): void
    {
        // prepare
        $configs = Yaml::parse(file_get_contents($this->getConfigPath()));

        $containerDefinitionMock = $this->createMock(Definition::class);
        $containerDefinitionMock->expects($this->at(0))
            ->method('setArgument')
            ->with(0, TranslatorFactory::DEEP_L);
        $containerDefinitionMock->expects($this->at(1))
            ->method('setArgument')
            ->with(
                1,
                [
                    ConfigDefinition::API_KEY => '<- the API key->',
                ]
            );

        $containerMock = $this->createMock(ContainerBuilder::class);
        $containerMock->method('getDefinition')->willReturn($containerDefinitionMock);

        $classUnderTest = new BasilicomFieldTranslatorExtension();

        // test
        $classUnderTest->load($configs, $containerMock);
        // verified by setup
    }

    /**
     * @return string
     */
    private function getConfigPath(): string
    {
        return dirname(dirname(dirname(dirname(__DIR__)))) . '/src/Resources/config/pimcore/config.example.yml';
    }
}
