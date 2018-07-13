FROM alpine:3.6
MAINTAINER Anna Novikova <anna@novikova.us>

RUN apk --no-cache add tar curl

#Install Caddy Server, and All Middleware
RUN curl "https://caddyserver.com/download/linux/amd64" \
    | tar --no-same-owner -C /usr/bin/ -xz caddy

#Copy over a default Caddyfile
COPY ./Caddyfile /etc/Caddyfile
COPY dist/ /var/www/html

EXPOSE 5000
WORKDIR /var/www/html

CMD ["/usr/bin/caddy", "-conf=/etc/Caddyfile"]