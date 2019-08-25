#!/bin/bash


if [ $CI_RUNNER_TAGS = "dev" ]
then
  echo "192.168.231.130 server.local" >> /etc/hosts
else
  echo "192.168.197.137 server.local" >> /etc/hosts
fi