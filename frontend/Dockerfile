FROM debian:bullseye-slim

RUN apt-get update && \
    apt-get install -y nginx openssl dumb-init && \
    apt-get install npm -y 

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY tools/entrypoint.sh /entrypoint.sh
COPY ./index.html /var/www/html/index.html
COPY ./package-lock.json /var/www/html/package-lock.json
COPY ./package.json /var/www/html/package.json

RUN cd /var/www/html && npm install

# 개발단계에서 코드 수정 시 docker compose 속도 올리기 위해서 이동
COPY ./src /var/www/html/src

RUN chmod +x /entrypoint.sh

EXPOSE 443

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/entrypoint.sh"]