FROM ubuntu
MAINTAINER Mr.Panda<xivistudios@gmail.com>

WORKDIR /root
ADD /root/project
COPY . /root/project

RUN curl -O https://nodejs.org/dist/v10.16.0/node-v10.16.0-linux-x64.tar.xz && \
    tar xvf node-v10.16.0-linux-x64.tar.xz && \
    rm -f ./node-v10.16.0-linux-x64.tar.xz && \
    mv ./node-v10.16.0-linux-x64 ./node && \
    export PATH=$PATH:"/usr/local/src/node/bin" && \
    cd /root && \

EXPOSE 81
CMD ["node", "/root/project/main.js"]