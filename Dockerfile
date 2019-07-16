FROM jakemakesstuff/apache2-php-docker
COPY . /var/www/public
RUN rm -rf /var/www/public/k8s
