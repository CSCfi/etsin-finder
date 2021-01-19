This repository, etsin-finder, contains code for the Fairdata platforms Etsin and Qvain

# Docker setup

1 Install docker
2 Install docker-compose
3 Clone this repository
4 Navigate to root
5 Run `docker-compose build`
6 Run `docker-compose up`

# Separate commands for building the images
- `docker build -f etsin_finder/frontend/webpack.dockerfile -t etsin-qvain-webpack etsin_finder/frontend`
- `docker build -f flask.dockerfile -t etsin-qvain-flask ./`

# Build status

## Test branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=test)](https://travis-ci.com/CSCfi/etsin-finder)

## Stable branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=stable)](https://travis-ci.com/CSCfi/etsin-finder)

License
-------
Copyright (c) 2018-2020 Ministry of Education and Culture, Finland

Licensed under [MIT License](LICENSE)