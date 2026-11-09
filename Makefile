# SPDX-FileCopyrightText: 2016-2024 Nextcloud GmbH and Nextcloud contributors
# SPDX-FileCopyrightText: 2015-2016 ownCloud, Inc.
# SPDX-License-Identifier: AGPL-3.0-or-later
app_name=logreader
project_dir=$(CURDIR)/../$(app_name)
build_dir=$(project_dir)/build
appstore_dir=$(build_dir)/appstore
package_name=$(app_name)
cert_dir=$(HOME)/.nextcloud/certificates
webpack=node_modules/.bin/webpack

othersources=$(wildcard appinfo/*) $(wildcard css/*/*) $(wildcard controller/*/*) $(wildcard templates/*/*) $(wildcard log/*/*)

.PHONY: all build-js-production
all: build-js-production

clean:
	rm -rf $(build_dir)
	rm -rf node_modules

node_modules: package.json package-lock.json
	npm ci

build-js-production: node_modules
	npm run build

.PHONY: watch
watch: node_modules
	npm run dev:watch

appstore: clean build-js-production package

package: build/appstore/$(package_name).tar.gz
build/appstore/$(package_name).tar.gz: build-js-production $(othersources)
	mkdir -p $(appstore_dir)
	tar --exclude-vcs \
	--exclude=$(build_dir) \
	--exclude=$(project_dir)/node_modules \
	--exclude=$(project_dir)/.gitattributes \
	--exclude=$(project_dir)/.github \
	--exclude=$(project_dir)/.gitignore \
	--exclude=$(project_dir)/.l10nignore \
	--exclude=$(project_dir)/.php-cs-fixer.dist.php \
	--exclude=$(project_dir)/.tx \
	--exclude=$(project_dir)/codecov.yml \
	--exclude=$(project_dir)/composer.json \
	--exclude=$(project_dir)/composer.lock \
	--exclude=$(project_dir)/eslint.config.mjs \
	--exclude=$(project_dir)/package-lock.json \
	--exclude=$(project_dir)/package.json \
	--exclude=$(project_dir)/psalm.xml \
	--exclude=$(project_dir)/rector.php \
	--exclude=$(project_dir)/README.md \
	--exclude=$(project_dir)/REUSE.toml \
	--exclude=$(project_dir)/screenshots \
	--exclude=$(project_dir)/src \
	--exclude=$(project_dir)/tests \
	--exclude=$(project_dir)/tsconfig.json \
	--exclude=$(project_dir)/vendor-bin \
	--exclude=$(project_dir)/vite.config.ts \
	--exclude=$(project_dir)/Makefile \
	-cvzf $(appstore_dir)/$(package_name).tar.gz $(project_dir)
	openssl dgst -sha512 -sign $(cert_dir)/$(app_name).key $(appstore_dir)/$(app_name).tar.gz | openssl base64

