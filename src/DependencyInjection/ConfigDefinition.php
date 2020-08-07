<?php

namespace Basilicom\FieldTranslatorBundle\DependencyInjection;

use Basilicom\FieldTranslatorBundle\Translator\TranslatorFactory;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class ConfigDefinition implements ConfigurationInterface
{
    public const STRATEGY = 'strategy';
    public const CONFIG = 'config';
    public const API_KEY = 'apiKey';

    /**
     * {@inheritdoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('basilicom_field_translator');
        $treeBuilder
            ->getRootNode()
            ->children()
                ->enumNode(self::STRATEGY)
                    ->values(
                        [
                            TranslatorFactory::GOOGLE_TRANSLATE,
                        ]
                    )
                ->end()
                ->arrayNode(self::CONFIG)
                    ->children()
                        ->scalarNode(self::API_KEY)->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}
