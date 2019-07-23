FROM node:latest
MAINTAINER Mr.Panda<xivistudios@gmail.com>
COPY . /root/project
WORKDIR /root/project
RUN npm i
CMD node main.js