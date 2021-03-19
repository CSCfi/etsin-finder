# etsin-finder

- This repository, etsin-finder, contains code for the Fairdata platforms Etsin and Qvain
- For a complete development setup of Etsin and Qvain, see `github.com/CSCfi/fairdata-docker`

# Updating docker images

Two of the four Docker images are built (and can thus be edited) manually: webpack (frontend) and flask (backend)

First, login:
`docker login fairdata-docker.artifactory.ci.csc.fi`

Then, the service specific images can be pushed (see below)

## Updating etsin-qvain-webpack

1 Build image:
- `docker build -f etsin_finder/frontend/webpack.dockerfile -t etsin-qvain-webpack etsin_finder/frontend`

2 Tag image:
- `docker tag etsin-qvain-webpack fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-webpack`

3 Push image:
- `docker push fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-webpack`

## Updating etsin-qvain-flask

1 Build image:
- `docker build -f flask.dockerfile -t etsin-qvain-webpack .`

2 Tag image:
- `docker tag etsin-qvain-webpack fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-webpack`

3 Push image:
- `docker push fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-webpack`

# Build status

## Test branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=test)](https://travis-ci.com/CSCfi/etsin-finder)

## Stable branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=stable)](https://travis-ci.com/CSCfi/etsin-finder)

License
-------
Copyright (c) 2018-2020 Ministry of Education and Culture, Finland

Licensed under [MIT License](LICENSE)
