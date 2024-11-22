# build the nuxt app
FROM node:20-alpine as build-app

# create destination directory
RUN mkdir -p /app
WORKDIR /app

# copy the app, note .dockerignore
COPY . .
RUN npm install
RUN npm run generate

# build the server
# https://lipanski.com/posts/smallest-docker-image-static-website
FROM alpine:3.13.2 AS build-server

ARG THTTPD_VERSION=2.29

# Install all dependencies required for compiling thttpd
RUN apk add gcc musl-dev make

# Download thttpd sources
RUN wget http://www.acme.com/software/thttpd/thttpd-${THTTPD_VERSION}.tar.gz \
  && tar xzf thttpd-${THTTPD_VERSION}.tar.gz \
  && mv /thttpd-${THTTPD_VERSION} /thttpd

# Compile thttpd to a static binary which we can copy around
RUN cd /thttpd \
  && ./configure \
  && make CCOPT='-O2 -s -static' thttpd

# Create a non-root user to own the files and run our server
RUN adduser -D static

# Switch to the scratch image
FROM scratch

EXPOSE 3000

# Copy over the user
COPY --from=build-server /etc/passwd /etc/passwd

# Copy the thttpd static binary
COPY --from=build-server /thttpd/thttpd /

# Use our non-root user
USER static
WORKDIR /home/static

# Copy the static website
COPY --from=build-app /app/dist .

# Run thttpd
CMD ["/thttpd", "-D", "-h", "0.0.0.0", "-p", "3000", "-d", "/home/static", "-u", "static", "-l", "-", "-M", "60"]
