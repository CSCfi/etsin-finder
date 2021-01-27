This repository, etsin-finder, contains code for the Fairdata platforms Etsin and Qvain

# Docker setup

1 Install docker
2 Install docker-compose
3 Edit your local /etc/hosts file to include the following two lines:
    - `0.0.0.0        etsin.local.fd-test.csc.fi`
    - `0.0.0.0        qvain.local.fd-test.csc.fi`
4 Clone this repository
5 Navigate to root
6 Retrieve the local app_config file and place it in the root of this repository
7 Retrieve the required certificates (crt/key) and place them in the folder nginx/certs
8 Run `docker-compose build`
9 Run `docker-compose up`

# Separate commands for building the images
- `docker build -f etsin_finder/frontend/webpack.dockerfile -t etsin-qvain-webpack etsin_finder/frontend`
- `docker build -f flask.dockerfile -t etsin-qvain-flask ./`
- `docker build -f nginx/nginx.dockerfile -t etsin-qvain-nginx nginx/`

# Build status

## Test branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=test)](https://travis-ci.com/CSCfi/etsin-finder)

## Stable branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=stable)](https://travis-ci.com/CSCfi/etsin-finder)

License
-------
Copyright (c) 2018-2020 Ministry of Education and Culture, Finland

Licensed under [MIT License](LICENSE)