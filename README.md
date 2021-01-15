This repository, etsin-finder, contains code for the Fairdata platforms Etsin and Qvain

# Docker setup

1 Install Docker
2 Clone this repository
3 Navigate to root
4 Build and run Flask:
    - docker build . -t etsin-qvain-flask  
    - docker run -p 5000:5000 -d etsin-qvain-flask
5 Build and run npm:
    - docker build etsin_finder/frontend -t etsin-qvain-webpack 
    - docker run -p 8080:8080 -d etsin-qvain-webpack
6 Run in container

# Build status

## Test branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=test)](https://travis-ci.com/CSCfi/etsin-finder)

## Stable branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=stable)](https://travis-ci.com/CSCfi/etsin-finder)

License
-------
Copyright (c) 2018-2020 Ministry of Education and Culture, Finland

Licensed under [MIT License](LICENSE)