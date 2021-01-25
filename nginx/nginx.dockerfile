FROM nginx:1.17-alpine

# Certificates
COPY certs/ /etc/nginx/ssl_certs/

# Nginx configurations
COPY nginx.conf /etc/nginx/nginx.conf
COPY server_common.conf /etc/nginx/server_common.conf
COPY shared_headers.conf /etc/nginx/shared_headers.conf
COPY shared_ssl_configurations.conf /etc/nginx/shared_ssl_configurations
COPY api_response_headers.conf /etc/nginx/api_response_headers
COPY static_file_headers.conf /etc/nginx/static_file_headers.conf
COPY elastic_headers.conf /etc/nginx/elastic_headers.conf