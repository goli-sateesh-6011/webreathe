# Single-Stage: Base PHP environment with Composer
FROM php:8.1-fpm as base

# Install system dependencies
RUN apt-get update && apt-get install -y \
	libonig-dev \
	libxml2-dev \
	npm \
	default-mysql-client \
	netcat-openbsd \
	&& docker-php-ext-install pdo_mysql

# libonig-dev used for multibyte encoding like UTF-8
# libxml2-dev used for XML parsing library.
# netcat-openbsd to install's nc to check whether mysql is ready or not for the migration
# pdo_mysql is intalled to make an communication between php and mysql 

# Set working directory
WORKDIR /var/www

# Coping the entire application
COPY . .

# Installing PHP dependencies using Composer 
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN composer install --no-dev --optimize-autoloader

#Installing Node.js dependencies
RUN npm install && \
	npm install @restart/ui --save

#For the frontend 
EXPOSE 8000  	
EXPOSE 5173

#For Staging -- docker-compose 
#CMD /bin/bash -c "while ! nc -z db 3306; do sleep 1; done; php artisan migrate && php artisan serve --host=0.0.0.0 --port=8000 & npm run dev -- --host"
CMD /bin/bash -c "while ! nc -z mysql-svc 3306; do sleep 1; done; php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000 & npm run dev -- --host"

#Build Frontend assets for Production
#RUN npm run build

#For the Production
#ENV APP_ENV=production
#ENV APP_DEBUG=false

#For Prodcution -- Kubernetes
#CMD /bin/bash -c "while ! nc -z mysql-svc 3306; do sleep 1; done; php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000"