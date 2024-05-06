<!--
  - SPDX-FileCopyrightText: 2016-2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-FileCopyrightText: 2015-2016 ownCloud, Inc.
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
# Log Reader

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud/logreader)](https://api.reuse.software/info/github.com/nextcloud/logreader)

![screenshot](https://i.imgur.com/0Y9G8lS.png)

Log reader for Nextcloud with clean exception display, infinite scrolling and more.

## Install instructions

### Installed by default

Log Reader is installed by default in recent versions of Nextcloud so you don't have to do anything  else to use the app.

### Install the latest stable release manually

 - Download the last pre-build [release](https://github.com/nextcloud/logreader/releases)
 - Extract the `tar.gz` into the apps folder
 
### Install from source

 - clone the repo in the apps folder
 - Run `make` in the `logreader` folder

## Developing

For building the app `node` and `npm` are required

### Building

Building the app can be done using the `Makefile`

```
make
```

### Automatic rebuilding during development

During development the webpack dev server can be used to automatically build the code
for every change.

Since the compiled source from the webpack dev server need to be injected in the regular Nextcloud
sources a proxy setup is needed to combine things.

If your local Nextcloud setup runs at http://localcloud an nginx configuration for the proxy
would look like the following:

```
server {
    listen 81;
    server_name localcloud;

    location /apps/logreader/build/main.js {
        proxy_pass http://localhost:3000/build/main.js;
    }
    location /apps/logreader/build/main.css {
        return 404;
    }
    
    location /build {
        proxy_pass http://localhost:3000;
    }
    location /__webpack_hmr {
        proxy_set_header Host $host;
        proxy_pass http://localhost:3000;
        proxy_set_header Connection '';
        proxy_http_version 1.1;
        chunked_transfer_encoding off;
        proxy_buffering off;
        proxy_cache off;
    }

    location / {
        proxy_set_header Host $host;
        proxy_hide_header Content-Security-Policy;
        proxy_pass http://localcloud/;
    }
}

```

This will run the proxy at http://localcloud:81/

With the proxy configured you can start the webpack dev server and specify where the
Nextcloud proxy is.
 
```
PROXY_URL="http://localcloud:81/ make watch
```
