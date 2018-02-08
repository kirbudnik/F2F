#!/bin/bash

NGINX_CONF=/etc/nginx/nginx.conf

function setPlaceholder {
    if [ -z "$2" ]; then
        echo "Undefined replacement for $1"
        exit 1
    fi

    echo "Replacing $1/$2"
    sed -i "s/$1/$2/g" ${NGINX_CONF}
}


if [ -z "$NGINX_ENVIRONMENT" ]; then
    echo "NGINX_ENVIRONMENT env is required"
    exit 1
fi


echo "Replacing nginx config placeholders"

# FIXME - May be possible to replace NGINX_ENVIRONMENT with CIRCLE_TAG
# Can we access circle tag in here?
if [ "$NGINX_ENVIRONMENT" == "development" ]; then
    setPlaceholder "___DOMAIN___" "dev.f2f.live"
    setPlaceholder "___LETSENCRYPT_IP___" "dev.f2f.live"
    setPlaceholder "___LETSENCRYPT_PORT___" "8080"
    setPlaceholder "___LETSENCRYPT_HTTPS_IP___" "dev.f2f.live"
    setPlaceholder "___LETSENCRYPT_HTTPS_PORT___" "4343"
    setPlaceholder "___NGINX_HTTP_PORT___" "81"
    setPlaceholder "___NGINX_HTTPS_PORT___" "444"
    setPlaceholder "___NGINX_STATUS_PORT___" "15973"
elif [ "$NGINX_ENVIRONMENT" == "staging" ]; then
    setPlaceholder "___DOMAIN___" "staging.f2f.live"
    setPlaceholder "___LETSENCRYPT_IP___" "staging.f2f.live"
    setPlaceholder "___LETSENCRYPT_PORT___" "8080"
    setPlaceholder "___LETSENCRYPT_HTTPS_IP___" "staging.f2f.live"
    setPlaceholder "___LETSENCRYPT_HTTPS_PORT___" "4343"
    setPlaceholder "___NGINX_HTTP_PORT___" "80"
    setPlaceholder "___NGINX_HTTPS_PORT___" "443"
    setPlaceholder "___NGINX_STATUS_PORT___" "15972"
else
    setPlaceholder "___DOMAIN___" "f2f.live"
    setPlaceholder "___LETSENCRYPT_IP___" "f2f.live"
    setPlaceholder "___LETSENCRYPT_PORT___" "8080"
    setPlaceholder "___LETSENCRYPT_HTTPS_IP___" "f2f.live"
    setPlaceholder "___LETSENCRYPT_HTTPS_PORT___" "4343"
    setPlaceholder "___NGINX_HTTP_PORT___" "80"
    setPlaceholder "___NGINX_HTTPS_PORT___" "443"
    setPlaceholder "___NGINX_STATUS_PORT___" "15972"
fi


echo "Staring ngingx"

nginx -g 'daemon off;'

exit 0
