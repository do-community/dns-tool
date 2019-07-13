FROM ubuntu:19.04
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y apache2
EXPOSE 80
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
COPY .  /var/www/public
RUN rm -rf /var/www/public/k8s
RUN rm /var/www/public/000-default.conf
CMD /usr/sbin/apache2ctl -D FOREGROUND
