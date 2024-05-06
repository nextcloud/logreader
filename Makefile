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

jssources=$(wildcard js/*) $(wildcard js/*/*) $(wildcard css/*/*)  $(wildcard css/*)
othersources=$(wildcard appinfo/*) $(wildcard css/*/*) $(wildcard controller/*/*) $(wildcard templates/*/*) $(wildcard log/*/*)

all: build/main.js

clean:
	rm -rf $(build_dir)
	rm -rf node_modules

node_modules: package.json
	npm install --deps

build/main.js: node_modules $(jssources)
	npm run build

.PHONY: watch
watch: node_modules
	node node_modules/.bin/webpack-dev-server --public localcloud.icewind.me:444 --inline --hot --port 3000 --config webpack/dev.config.js

appstore: clean build/main.js package

package: build/appstore/$(package_name).tar.gz
build/appstore/$(package_name).tar.gz: build/main.js $(othersources)
	mkdir -p $(appstore_dir)
	tar --exclude-vcs \
	--exclude=$(appstore_dir) \
	--exclude=$(project_dir)/node_modules \
	--exclude=$(project_dir)/webpack \
	--exclude=$(project_dir)/.gitattributes \
	--exclude=$(project_dir)/.gitignore \
	--exclude=$(project_dir)/.travis.yml \
	--exclude=$(project_dir)/.tx \
	--exclude=$(project_dir)/.scrutinizer.yml \
	--exclude=$(project_dir)/CONTRIBUTING.md \
	--exclude=$(project_dir)/package.json \
	--exclude=$(project_dir)/screenshots \
	--exclude=$(project_dir)/Makefile \
	-cvzf $(appstore_dir)/$(package_name).tar.gz $(project_dir)
	openssl dgst -sha512 -sign $(cert_dir)/$(app_name).key $(appstore_dir)/$(app_name).tar.gz | openssl base64

