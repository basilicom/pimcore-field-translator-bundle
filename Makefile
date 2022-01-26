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

.PHONY: watch
watch: ## Run watchers for development
	$(MAKE) yarn-watch

.PHONY: test
test: ## Run ALL tests
	./vendor/bin/phpunit --configuration ./tests/phpunit.xml --stderr --no-coverage

.PHONY: destroy
destroy: ## Run ALL tests
	docker-compose -f docker-compose.pimcore-6.yml down -v --remove-orphans
	docker-compose -f docker-compose.pimcore-x.yml down -v --remove-orphans

PROJECT_DIR = ${PWD}

.PHONY: prepare-composer-for-test-setup
prepare-composer-for-test-setup:
	@rm -rf "/tmp/docker-tmp/"
	@COMPOSER_MEMORY_LIMIT=-1 composer create-project --prefer-dist --no-scripts --no-install pimcore/skeleton "/tmp/docker-tmp" 2.8
	@ln -s $(PROJECT_DIR) "/tmp/docker-tmp/pimcore-field-translator-bundle"
	@cd "/tmp/docker-tmp" && composer config repositories.pimcore-field-translator-bundle path ./pimcore-field-translator-bundle && \
        composer config minimum-stability dev && \
        COMPOSER_MEMORY_LIMIT=-1 composer require basilicom/pimcore-field-translator-bundle:@dev --prefer-source --no-scripts --prefer-stable --update-with-all-dependencies && \
        cp composer.lock "$(PROJECT_DIR)/composer.docker.lock"
#	@rm -rf "/tmp/docker-tmp/"

.PHONY: setup-pimcore-6
setup-pimcore-6:
	@docker-compose -f docker-compose.pimcore-6.yml up -d
	@docker exec -it pimcore-php bash -c "composer self-update --1"
	@docker exec -it --user www-data pimcore-php bash -c "rm -rf ./* && composer create-project --no-scripts --prefer-dist --no-dev pimcore/skeleton tmp 2.8 && \
        mv tmp/.[!.]* . && mv tmp/* . && rmdir tmp && \
        cp /pimcore-field-translator-bundle/composer.docker.lock ./composer.lock && \
        ln -s /pimcore-field-translator-bundle pimcore-field-translator-bundle && \
        ./vendor/bin/pimcore-install --mysql-host-socket=db --mysql-username=pimcore --mysql-password=pimcore --mysql-database=pimcore --admin-username admin --admin-password admin --no-interaction && \
        composer install && \
        bin/console pimcore:bundle:install BasilicomFieldTranslatorBundle && bin/console pimcore:bundle:enable BasilicomFieldTranslatorBundle && \
        chmod 0777 -R config bin composer.json var"
	@docker exec -it pimcore-php bash -c "echo 'memory_limit = 512M' >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini && service apache2 reload"

.PHONY: setup-pimcore-x
setup-pimcore-x:
	@docker-compose -f docker-compose.pimcore-x.yml up -d
	@docker exec -it pimcore-php bash -c "composer self-update --2"
	@docker exec -it --user www-data pimcore-php bash -c "rm -rf ./* && composer create-project --no-scripts --prefer-dist --no-dev pimcore/skeleton tmp 10.x-dev && \
        mv tmp/.[!.]* . && mv tmp/* . && rmdir tmp && \
        cp /pimcore-field-translator-bundle/composer.docker.lock ./composer.lock && \
        ln -s /pimcore-field-translator-bundle pimcore-field-translator-bundle && \
        ./vendor/bin/pimcore-install --mysql-host-socket=db --mysql-username=pimcore --mysql-password=pimcore --mysql-database=pimcore --admin-username admin --admin-password admin --no-interaction && \
        composer install && \
        bin/console pimcore:bundle:install BasilicomFieldTranslatorBundle && bin/console pimcore:bundle:enable BasilicomFieldTranslatorBundle && \
        chmod 0777 -R config bin composer.json var"
	@docker exec -it pimcore-php bash -c "echo 'memory_limit = 512M' >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini && service apache2 reload"

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
	./vendor/bin/local-php-security-checker --path=./composer.lock | tee $(TMP_DIR)/logs/security-check.log || (echo "security-check failed $$?"; exit 1)
	docker run --rm -it --volume ${PWD}:/app --workdir /app node:14-alpine sh -c "npm i --package-lock-only && npm audit --audit-level=high --production && unlink package-lock.json"
