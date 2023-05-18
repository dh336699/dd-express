#!/bin/bash

tag="v1_"$(date +%Y%m%d%H%M%S)
echo $tag
docker build -t scofield336699/dd-express:$tag .

docker login -u dh336699 -p Dh336699..

docker push scofield336699/dd-express:$tag