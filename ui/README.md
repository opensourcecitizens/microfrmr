## UI 

Use the examples in ../mock_ui/appData/ApiCaller.js and ../mock_ui/components/ImageHandler.js
 to create a API call to update and retrieve data.

### ../remote_services
This directory contains implementations of backend services that connect to the 
persistence layer.  Go to -> [../remote_services](../remote_services/README.md)

#### Fetch data using ../mock_ui/appData/ApiCaller.js

This file provides example methods for calling a backend API which
is implemented here -> [../remote_services/api](../remote_services/api/README.md)

Note: you should start the api beforehand by following instructions there.

#### Handle image fetching and persistence using ../mock_ui/components/ImageHandler.js

This is a UI component that can help with dynamic loading of images by connecting to your local ipfs server
using WebSockets.
IPFS service should be running locally if you successfully followed this instructions in -> [../remote_services/docker](../remote_services/docker/README.md).