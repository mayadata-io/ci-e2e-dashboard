#!/usr/bin/env bash

# This file will replace the images and css of mo-vendors if ENV `VENDOR` is set
if [ -n "$VENDOR" ];then
    echo "------ copying language file ------"
    cp -rv /tmp/mo-vendor/workload/default-en.json /usr/share/nginx/html/assets/languages/
    cp -rv /tmp/mo-vendor/workload/image/. /usr/share/nginx/html/assets/images/
fi
# start nginx daemon
nginx-debug -g "daemon off;"