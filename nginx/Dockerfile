FROM nginx:alpine
LABEL maintainer="deh0022@uah.edu"
LABEL version="0.1"
LABEL description="nginx proxy for BMU"

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
