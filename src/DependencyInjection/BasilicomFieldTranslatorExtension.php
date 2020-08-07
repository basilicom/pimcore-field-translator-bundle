<?php

namespace Basilicom\FieldTranslatorBundle\DependencyInjection;

use Basilicom\FieldTranslatorBundle\Translator\TranslatorFactory;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

class BasilicomFieldTranslatorExtension extends Extension
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new ConfigDefinition();
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $loader->load('services.yml');

        $translatorStrategy = (string) $config[ConfigDefinition::STRATEGY];
        $translatorConfig = (array) $config[ConfigDefinition::CONFIG];
        $container->getDefinition(TranslatorFactory::class)->setArgument(0, $translatorStrategy);
        $container->getDefinition(TranslatorFactory::class)->setArgument(1, $translatorConfig);
    }
}
