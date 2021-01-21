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
	docker run --rm -it --volume $(PWD):/app --user $(shell id -u):$(shell id -g) -v $(COMPOSER_HOME):/tmp composer:1.10 install --ignore-platform-reqs --no-scripts

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

.PHONY: test
test: ## Run ALL tests
	./vendor/bin/phpunit --configuration ./tests/phpunit.xml --stderr --no-coverage

### Security Checker 2021
UNAME_S := $(shell uname -s)
SEC_CHECK_URL := "https://github.com/fabpot/local-php-security-checker/releases/download/v1.0.0/local-php-security-checker_1.0.0_"

ifeq ($(UNAME_S),Linux)
	SEC_CHECK_URL:="$(SEC_CHECK_URL)linux_amd64"
else ifeq ($(UNAME_S),Darwin)
	SEC_CHECK_URL:="$(SEC_CHECK_URL)darwin_amd64"
endif

vendor/bin/local-php-security-checker:
	wget ${SEC_CHECK_URL} -O $@ && chmod a+x $@

.PHONY: security-check
security-check: ./vendor/bin/local-php-security-checker
#	./vendor/bin/local-php-security-checker --path=./composer.lock | tee $(TMP_DIR)/logs/security-check.log || (echo "security-check failed $$?"; exit 1)
	docker run --rm -it --volume ${PWD}:/app --workdir /app node:14-alpine sh -c "npm i --package-lock-only && npm audit --audit-level=high --production && unlink package-lock.json"
