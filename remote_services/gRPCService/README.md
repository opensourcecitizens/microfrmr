## Micrfrmr gRPC Mongodb sync

(web app client) ---gRPC---> (API service) ----tcp---> (mongo db)

This is a gRPC service which is recommended for web apps.

Native applications such as iOS and android may require gRPCWeb or a proxy web service.

## Requirements 
node version 16+
npm version 8.19+ 

## Prep
Install node.

Install nvm and npm versions then select version:
> nvm use 8.19..

Install dependencies listed in package.json.
> npm update


## Start the service
> node server.js

# Testing 
> node tests/test.js
