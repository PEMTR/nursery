#!/bin/bash

cat > /etc/apt/sources.listt << EOF
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
EOF

apt update && apt full-upgrade -y
apt install git curl tar
cd /usr/local/src
curl -O https://nodejs.org/dist/v10.16.3/node-v10.16.3-linux-x64.tar.xz
tar xvf node-v10.16.3-linux-x64.tar.xz
rm -f ./node-v10.16.3-linux-x64.tar.xz
mv node-v10.16.3-linux-x64 node
ln -s /usr/local/src/node/bin/node /usr/local/bin/node
ln -s /usr/local/src/node/bin/npm /usr/local/bin/npm

cat >> /etc/hosts << EOF

192.168.231.130 server.local
EOF