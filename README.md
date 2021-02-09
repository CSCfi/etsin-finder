This repository, etsin-finder, contains code for the Fairdata platforms Etsin and Qvain

# Docker setup

1. Clone this repository
2. Install docker (docker.com/get-started)
3. Install docker-compose (docs.docker.com/compose/install/)
4. Edit your local /etc/hosts file to include the following two lines:
    - `0.0.0.0        etsin.local.fd-test.csc.fi`
    - `0.0.0.0        qvain.local.fd-test.csc.fi`
5. Navigate to root (`cd etsin-finder`)
6. Retrieve the local app_config file and place it in the root of this repository
7. Retrieve the required certificates (crt/key) and place them in the folder nginx/certs
8. Build the three (3) Docker images (webpack, flask, nginx):
- `docker build -f etsin_finder/frontend/webpack.dockerfile -t etsin-qvain-webpack etsin_finder/frontend`
- `docker build -f flask.dockerfile -t etsin-qvain-flask ./`
- `docker build -f nginx/nginx.dockerfile -t etsin-qvain-nginx nginx/`
9. Navigate to the frontend folder
- `cd etsin_finder/frontend`
10. Build the `etsin_finder/frontend/node_modules` folder:
- `docker run --rm -v $PWD:/etsin_finder/frontend -it etsin-qvain-webpack npm install`
- This will build the `node_modules` folder inside the Docker container, even if npm is not installed
11. Build the `/build` folder inside:
- `cd etsin_finder/frontend && docker run --rm -v $PWD:/etsin_finder/frontend -it etsin-qvain-webpack npm start`
- This will build the `build` folder inside the Docker container
12. Run `docker-compose up`
13. The app etsin-finder should now be available at the DNS addresses specified above in step 4, with hot reload enabled

# Build status

## Test branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=test)](https://travis-ci.com/CSCfi/etsin-finder)

## Stable branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=stable)](https://travis-ci.com/CSCfi/etsin-finder)

License
-------
Copyright (c) 2018-2020 Ministry of Education and Culture, Finland

Licensed under [MIT License](LICENSE)