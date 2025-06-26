# Dev backend service / data source

You are going to host several service simultaneously on your local machine using docker!
These instructions will launch:
  - micrfrmr_mongodb 
  - ipfs
  - ipfs-proxy api.
  - redis
There are also seed data loader:
  - mongo-seed 
  - ipfs-seed 


#### About Docker
Docker is virtual engine api that allows developers to compatmentalize APIs, OS, and configuration requirements as
individual deployments. This allows easy management of development, distribution and scaling.
- https://docs.docker.com/engine/

#### About Mongodb
This is a json document store. The mongodb api allows you to create, update and delete json documents using a standard
syntax.
- https://www.mongodb.com/resources/products/fundamentals/examples

This is a mongodb which can be used during development and testing to simulate a production database.
The database is hosted in a virtual docker container for easy deployment and sharing.

#### About ipfs
This is an opensource distributed file system that is suitable for public facing media. Each media is treated as unique 
objects that can be accessed anywhere in the world. 
You can configure your own cluster or rely on remote servers to distribute your data.

#### About seed services
These two services: mongo-seed and ipfs-seed, are used to load example data
into the persistence layer so that you can get started. They have been optimized for overwrites.

### Install docker and docker compose
>apt-get update

Install docker and docker compose plugin
>sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

### Create external volumes
Do this once
>docker volume create --name=mongo-persistence

>docker volume create --name=ipfs-persistence

>docker volume create --name=ipfs-staging

### Starting and stopping the data source docker
Go to working directory:
>cd remote_services/

From docker directory do:
Start Up:
>docker-compose -f docker/deploy_microfrmr-apis_mqtt_redis_ipfs.yaml up

Shut Down:
>docker-compose -f docker/deploy_microfrmr-apis_mqtt_redis_ipfs.yaml down

Note: take a close look at the log output to make sure there are no failures.

