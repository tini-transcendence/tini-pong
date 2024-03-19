FROM debian:bullseye-slim

RUN apt-get update && \
    apt-get install -y nginx openssl dumb-init && \
    apt-get install npm -y 

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY tools/entrypoint.sh /entrypoint.sh
COPY ./index.html /var/www/html/index.html
COPY ./src /var/www/html/src
COPY ./package-lock.json /var/www/html/package-lock.json
COPY ./package.json /var/www/html/package.json


RUN cd /var/www/html && npm install
## 도커 파일에서는 보안상의 이유 때문에 상위 디렉토리에 대한 참조가 허용되지 않는다. 
# COPY ./dist /var/www/html/dist/

RUN chmod +x /entrypoint.sh

EXPOSE 443

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/entrypoint.sh"]