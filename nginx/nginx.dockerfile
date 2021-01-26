FROM nginx:1.17-alpine

# Certificate tasks
COPY certs/ /etc/nginx/ssl_certs/

# Genearate nginx_dhparam (Diffie-Hellman parameters) for SSL
RUN apk update && apk add openssl
RUN openssl dhparam -out /etc/nginx/ssl_certs/nginx_dhparam.pem 2048 creates=/etc/nginx/ssl_certs/nginx_dhparam.pem

# Nginx configurations
COPY nginx.conf /etc/nginx/nginx.conf
COPY server_common.conf /etc/nginx/server_common.conf
COPY shared_headers.conf /etc/nginx/shared_headers.conf
COPY shared_ssl_configurations.conf /etc/nginx/shared_ssl_configurations.conf
COPY api_response_headers.conf /etc/nginx/api_response_headers.conf
COPY static_file_headers.conf /etc/nginx/static_file_headers.conf
COPY elastic_headers.conf /etc/nginx/elastic_headers.conf