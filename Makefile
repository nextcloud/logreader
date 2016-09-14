# Makefile for building the project

app_name=logreader
project_dir=$(CURDIR)/../$(app_name)
build_dir=$(project_dir)/build
appstore_dir=$(build_dir)/appstore
package_name=$(app_name)

sources=$(wildcard js/*) $(wildcard js/*/*)

all: build/main.js

clean:
	rm -rf $(build_dir)
	rm -rf node_modules

node_modules: package.json
	npm install --deps

build/main.js: node_modules $(sources)
	npm run build

appstore: clean build/main.js package

package: build/appstore/$(package_name).tar.gz
build/appstore/$(package_name).tar.gz: build/main.js
	mkdir -p $(appstore_dir)
	tar --exclude-vcs \
	--exclude=$(appstore_dir) \
	--exclude=$(project_dir)/node_modules \
	--exclude=$(project_dir)/webpack \
	--exclude=$(project_dir)/.gitattributes \
	--exclude=$(project_dir)/.gitignore \
	--exclude=$(project_dir)/.travis.yml \
	--exclude=$(project_dir)/.scrutinizer.yml \
	--exclude=$(project_dir)/CONTRIBUTING.md \
	--exclude=$(project_dir)/package.json \
	--exclude=$(project_dir)/Makefile \
	-cvzf $(appstore_dir)/$(package_name).tar.gz $(project_dir) \

