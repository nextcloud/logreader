# Makefile for building the project

app_name=logreader
project_dir=$(CURDIR)/../$(app_name)
build_dir=$(project_dir)/build
appstore_dir=$(build_dir)/appstore
package_name=$(app_name)

all: javascript

clean:
	rm -rf $(build_dir)
	rm -rf node_modules

node_modules: package.json
	npm install --deps

javascript: node_modules
	npm run build

appstore: clean javascript package

package:
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

