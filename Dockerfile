FROM node:18.17.0-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ="Europe/Paris"
ENV LC_ALL=fr_FR.UTF-8

WORKDIR /portal
COPY . .

RUN yarn install

RUN mkdir -p /portal/.nuxt
