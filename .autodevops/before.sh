#!/bin/bash

address=""

if [ $CI_RUNNER_TAGS = "dev" ]
then
  address="192.168.231.130"
else
  address="192.168.197.137"
fi


cat >> /etc/hosts << EOF

$address server.local
EOF