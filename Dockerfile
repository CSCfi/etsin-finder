# pull official base image
FROM python:3.6

# set work directory
WORKDIR /code

COPY requirements.txt /code/

RUN apt update
RUN apt-get install libxml2-dev libxmlsec1-dev libxmlsec1-openssl -y

RUN python -m venv /opt/venv

# set environment variables
ENV <ENV_VARIABLE_1> $ENV_VARIABLE_1
ENV <ENV_VARIABLE_2> $ENV_VARIABLE_2

# Activate virtual environment
RUN . /opt/venv/bin/activate

# install dependencies
RUN pip install --upgrade pip wheel
RUN pip install -r requirements.txt

# Bundle app source
COPY . .

ENTRYPOINT [ "python" ]

CMD [ "etsin_finder/app.py" ]
