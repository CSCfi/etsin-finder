# etsin-finder

- This repository, etsin-finder, contains code for the Fairdata platforms Etsin and Qvain
- The development setup makes use of Docker

## 1. Development setup prerequisites

1. If not installed, install docker on your computer
    - `docker.com/get-started`
2. If not installed, install docker-compose
    - `docs.docker.com/compose/install`

## 2. Development setup

0. First, complete the Etsin-Qvain-related steps here: `https://github.com/CSCfi/fairdata-docker/blob/master/README.md`

1. Edit your local /etc/hosts file to include the following two lines:
    - `0.0.0.0        etsin.local.fd-test.csc.fi`
    - `0.0.0.0        qvain.local.fd-test.csc.fi`

2. Build the three (3) Docker images (webpack, flask, nginx):
    - `docker build -f etsin_finder/frontend/webpack.dockerfile -t etsin-qvain-webpack etsin_finder/frontend`
    - `docker build -f flask.dockerfile -t etsin-qvain-flask ./`
    - `docker build -f nginx/nginx.dockerfile -t etsin-qvain-nginx nginx/`
3. Run:
    - `cd etsin_finder/frontend && docker run --rm -v $PWD:/etsin_finder/frontend -it etsin-qvain-webpack npm install`
    - This will navigate you to the frontend folder and build the `node_modules` folder inside the Docker container, even if npm is not installed on the host machine. This may take a few minutes.
4. When the above command is done, run:
    - `docker run --rm -v $PWD:/etsin_finder/frontend -it etsin-qvain-webpack npm start`
    - This will build the `build` folder inside the Docker container, even if npm is not installed on the host machine
    - When the command is done, exit the process (`CTRL + C` or `CMD + C`), the build folder will be left in place
5. Create a network so that external calls are available using the Python script in etsin-finder-search (step 7, below)
    - `cd ../..`
    - `docker swarm init`
    - `docker network create -d overlay --attachable elastic-network`
6. Finally, run the app:
    - `docker stack deploy -c docker-compose.yml etsin-qvain`
    - This will start the app etsin-finder, which should then be available at the DNS addresses specified above in step 2.1, with hot reload enabled, and all dependencies installed inside Docker containers
    - The backend (flask) and nginx will start first, followed by the frontend (webpack)
7. Setup `etsin-finder-search` and load test datasets from Metax:
    - Open new terminal window, go to etsin-finder-search (`git clone` the repository if not done already)
    - `cd ../etsin-finder-search`
    - `docker build -f python.dockerfile  -t etsin-search-python ./`
    - `docker run --network=elastic-network etsin-search-python python load_test_data.py amount_of_datasets=199`

# Build status

## Test branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=test)](https://travis-ci.com/CSCfi/etsin-finder)

## Stable branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=stable)](https://travis-ci.com/CSCfi/etsin-finder)

License
-------
Copyright (c) 2018-2020 Ministry of Education and Culture, Finland

Licensed under [MIT License](LICENSE)