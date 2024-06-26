#!/bin/bash
set -e

# Symbolic linking logs
ln -sf /dev/stdout /var/log/nginx/access.log && \
ln -sf /dev/stderr /var/log/nginx/error.log

# Generate openssl certificate
mkdir -p /etc/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/nginx.key \
        -out /etc/nginx/ssl/nginx.crt \
        -subj "/C=KR/L=Seoul/O=42Seoul/CN=nginx" \
        > /dev/null 2>&1

sed -i "s#localhost#${DOMAIN_NAME}#g" /var/www/html/src/index.js
sed -i "s#oauth_uid#${OAUTH_UID}#g" /var/www/html/src/index.js

# Execute nginx
exec nginx -g "daemon off;"