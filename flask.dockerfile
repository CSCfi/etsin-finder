# pull official base image
FROM python:3.6

# set work directory
WORKDIR /etsin_finder

COPY requirements.txt /etsin_finder/

RUN apt update
RUN apt-get install libxml2-dev libxmlsec1-dev libxmlsec1-openssl -y

# set environment variables
ENV <ENV_VARIABLE_1> $ENV_VARIABLE_1
ENV <ENV_VARIABLE_2> $ENV_VARIABLE_2

# install dependencies
RUN pip install --upgrade pip wheel
RUN pip install -r requirements.txt

ENV PYTHONPATH /etsin_finder

# Bundle app source
COPY . .

ENTRYPOINT [ "python", "etsin_finder/finder.py"]
