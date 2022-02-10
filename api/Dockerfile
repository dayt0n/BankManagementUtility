FROM python:3.10
LABEL maintainer="deh0022@uah.edu"
LABEL version="0.1"
LABEL description="api for BMU"

WORKDIR /app
COPY . .
RUN pip3 install .

RUN bash -l -c "echo API_SECRET_KEY="$(python3 -c 'from os import urandom;print(str(urandom(32))[1:])')" >> ./.env"

CMD [ "bmuapi" ]