#!/usr/bin/env bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

rm -rf "/tmp/docker-tmp/" &&
  COMPOSER_MEMORY_LIMIT=-1 composer create-project --prefer-dist --no-scripts --no-install pimcore/skeleton "/tmp/docker-tmp" 2.8
ln -s $DIR "/tmp/docker-tmp/field-translator-bundle"
cd "/tmp/docker-tmp" &&
  composer config repositories.field-translator-bundle path ./field-translator-bundle &&
  composer config minimum-stability dev &&
  COMPOSER_MEMORY_LIMIT=-1 composer require basilicom/pimcore-field-translator-bundle --no-scripts --prefer-stable --update-with-all-dependencies --ignore-platform-reqs &&
  cp composer.lock "$DIR/composer.docker.lock" &&
  rm -rf "/tmp/docker-tmp/"
