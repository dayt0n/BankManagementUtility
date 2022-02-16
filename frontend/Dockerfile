FROM node:latest
LABEL maintainer="deh0022@uah.edu"
LABEL version="0.1"
LABEL description="frontend for BMU"

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm install
RUN npm run build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve","-s","build"]