### Remote Services


#### docker
Follow these [instructions](./docker/README.md) to get you data layer up and ready.

#### api
Your mobile app uses this api service to fetch json data from the data layer.

#### gRPCService
gRPC is an alternative service to the api. This is not optimal for android or iOS apps at the moment so just 
have a look because we may use this as middleware for all data services and web apps.

#### mediaserver
-- Ignore this for now because an implementation of ipfs api is already implemented in
[docker](./docker/README.md) dir.