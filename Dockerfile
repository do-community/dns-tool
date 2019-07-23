FROM node:12 AS builder
WORKDIR /build
COPY . .
RUN npm i
RUN npm run build

FROM jakemakesstuff/apache2-php-docker
COPY --from=builder /build/dist /var/www/public
