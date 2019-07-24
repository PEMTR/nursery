FROM node:latest
MAINTAINER Mr.Panda<xivistudios@gmail.com>
COPY . /root/project
WORKDIR /root/project
CMD node main.js