#!/bin/bash

ENV=$1

if [ ENV == 'production' ]
then
  echo 'starting app in production'
  docker-compose up
else
  echp 'starting app in development'
  docker-compose -f docker-compose-dev.yml up
fi