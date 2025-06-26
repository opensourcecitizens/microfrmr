## API - Data sync to mongodb

(android/ios app) ---http---> (api) ----tcp---> (mongo db)

Written in nodejs. Is a RESTful api that can be used by native applications to read and update data from mongodb.

## Requirements
node version 16+
npm version 8.19+

### Prep
- Install node
- Install npm 
> apt-get install node npm
- Update dependencies:
> npm update

### Run the api 

>node app.js