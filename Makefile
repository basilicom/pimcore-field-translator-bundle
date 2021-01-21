SHELL := /bin/bash

.PHONY: help
help: ## Show help
	@IFS=$$'\n' ; \
    help_lines=(`fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//'`); \
    for help_line in $${help_lines[@]}; do \
        IFS=$$'#' ; \
        help_split=($$help_line) ; \
        help_command=`echo $${help_split[0]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
        help_info=`echo $${help_split[2]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
        printf "%-30s %s\n" $$help_command $$help_info ; \
    done

.PHONY: setup
setup: ## Setup the system locally
	COMPOSER_MEMORY_LIMIT=-1 composer install --no-scripts

	@echo "Build assets ..."
	$(MAKE) yarn-install
	$(MAKE) yarn-build

.PHONY: yarn-install
yarn-install: ## install npm dependencies
	docker run --rm --volume ${PWD}:/project --workdir /project node:14-alpine sh -c "yarn install --ignore-scripts --ignore-optional"

.PHONY: yarn-build
yarn-build: ## build frontend assets once
	docker run --rm --volume ${PWD}:/project --workdir /project node:14-alpine sh -c "npm rebuild node-sass && yarn build"

.PHONY: yarn-watch
yarn-watch: ## build frontend assets once
	docker run --rm --volume ${PWD}:/project --workdir /project node:14-alpine sh -c "npm rebuild node-sass && yarn watch"

.PHONY: watch
watch: ## Run watchers for development
	$(MAKE) yarn-watch

#########################
#				Tests						#
#########################
.PHONY: test
test: ## Run ALL tests
	./vendor/bin/phpunit --configuration ./tests/phpunit.xml --stderr --no-coverage
