//const redis = require("redis");
//const redisHost = args['redishost'] || 'localhost'
//const redisPort = args['redisport'] || '6379'
//const crypto = require('crypto');

const express = require("express");
const axios = require("axios");
const args = require('minimist')(process.argv.slice(2));
const mongodbServer = args['mongo_server'] || "mongodb://localhost:27017"
const port = args['port'] || 8099;
const corsPort = args['corsport'] || 8888;
const healthPort = args['healthport'] || 8899;

const DatabasePersist = require('./db_persists');
const mongodb = new DatabasePersist(mongodbServer);
/*let mongodb;
(async () => {
    mongodb = new DatabasePersist(mongodbPort);
} );*/

const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
app.use(express.json())

let redisClient;
/* //todo add later
(async () => {
  redisClient = redis.createClient({
                    socket: {
                        host: redisHost,
                        port: redisPort
                    },
                    //username: '<username>',
                    //password: '<password>'
                    //enable_offline_queue: false,
                    retry_max_delay: 1,
                });
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  redisClient.on("connect", () => console.log(`redisClient connected  at ${redisHost} : ${redisPort}`));

  await redisClient.connect();
})();

//Read redis - throws error
async function readFromRedis(path){
    //todo synchronously read from redis and update from mongo
    let results = await redisClient.hGetAll(path , {
      EX: 180,
      NX: true,
    });
    //console.log('readRedis result ', results);
    if (results.length === 0) {
      throw "Redis returned an empty array";
    }
    return results;
}

async function writeToRedis(path,input){
    //todo asynchronously write to mongo and redis
    let results = await redisClient.hSet(path, input);
    //console.log('write to Redis result ', results);
    if (results.length === 0) {
      throw "API returned an empty array";
    }
    return results;
}
*/

async function getUsersList(req, res) {
    //let results;
    mongodb.readUsersList().then(async(cursor)=>{
        let results = [];
        cursor.on("data", data => console.log(data));
        cursor.stream().on("sdata", data => console.log(data));
        results = await cursor.toArray();
        res.send({
          fromCache: false,
          data: results,
        });
        await cursor.close();
    }).catch((error)=>{
        console.error(error);
        res.status(404).send("Data unavailable due to: "+error);
    }).finally(async()=>{

    });
}

async function getUserProfile(req, res) {
  const userId = req.params.userId;
  console.log('getUserProfile userId ', userId);
  //let results;
  try {
    if(userId === null || userId === '' ) throw "Expected userId parameter";
    let results = await mongodb.readUserProfile(userId);
    //let results = await readFromRedis("user/"+userId)
    console.log('results for ',userId,'eq', results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable due to "+error);
  }
}

/**
* Insert or update user info.
*/
async function upsertUserProfile(req, res) {
  const userProfile = req.body;
  console.log('upsertUserProfile userProfile ', userProfile);
  //let results;
  try {
    //todo do some data validation
    let results = await mongodb.upsertUserProfile(userProfile);

    res.send({
      fromCache: false,
      data: results,
    });

  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable due to "+error);
  }
}

async function getProductList(req, res) {
    //let results;
    mongodb.readProductList().then(async(cursor)=>{
        let results = [];
        cursor.on("data", data => console.log(data));
        cursor.stream().on("sdata", data => console.log(data));
        results = await cursor.toArray();
        res.send({
          fromCache: false,
          data: results,
        });
        await cursor.close();
    }).catch((error)=>{
        console.error(error);
        res.status(404).send("Data unavailable due to: "+error);
    }).finally(async()=>{

    });
}

async function getProductDetails(req, res) {
  const productId = req.params.productId;
  console.log('getProductDetails productId ', productId);
  //let results;
  try {
    if(productId === null || productId === '' ) throw "Expected productId parameter";
    let results = await mongodb.readProductDetails(productId.toString());

    console.log('results for ',productId,'eq', results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable due to "+error);
  }
}

async function upsertProductDetails(req, res) {
  const productDetails = req.body;
  console.log('upsertProductDetails productDetails ', productDetails);
  //let results;
  try {
    let results = await mongodb.upsertProductDetails(productDetails);
    //console.log('writeProposalMetadata result ', results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

//FARM
async function getFarmList(req, res) {
    //let results;
    mongodb.readFarmList().then(async(cursor)=>{
        let results = [];
        cursor.on("data", data => console.log(data));
        cursor.stream().on("sdata", data => console.log(data));
        results = await cursor.toArray();
        res.send({
          fromCache: false,
          data: results,
        });
        await cursor.close();
    }).catch((error)=>{
        console.error(error);
        res.status(404).send("Data unavailable due to: "+error);
    }).finally(async()=>{

    });
}

async function getFarmDetails(req, res) {
  const farmId = req.params.farmId;
  console.log('getFarmDetails farmId ', farmId);
  //let results;
  try {
    if(farmId === null || farmId === '' ) throw "Expected farmId parameter";
    let results = await mongodb.readFarmDetails(farmId.toString());

    console.log('results for ',farmId,'eq', results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable due to "+error);
  }
}

async function upsertFarmDetails(req, res) {
  const farmDetails = req.body;
  console.log('upsertFarmDetails productDetails ', farmDetails);
  //let results;
  try {
    let results = await mongodb.upsertProductDetails(farmDetails);
    //console.log('writeProposalMetadata result ', results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

//LISTINGS
async function getListingsList(req, res) {
    //let results;
    mongodb.readListingsList().then(async(cursor)=>{
        let results = [];
        cursor.on("data", data => console.log(data));
        cursor.stream().on("sdata", data => console.log(data));
        results = await cursor.toArray();
        res.send({
          fromCache: false,
          data: results,
        });
        await cursor.close();
    }).catch((error)=>{
        console.error(error);
        res.status(404).send("Data unavailable due to: "+error);
    }).finally(async()=>{

    });
}

async function getListingDetails(req, res) {
  const listingId = req.params.listingId;
  console.log('getListingDetails listingId ', listingId);
  //let results;
  try {
    if(listingId === null || listingId === '' ) throw "Expected listingId parameter";
    let results = await mongodb.readListingDetails(listingId.toString());

    console.log('results for ',listingId,'eq', results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable due to "+error);
  }
}

async function upsertListingDetails(req, res) {
  const listingDetails = req.body;
  console.log('writeListingDetails productDetails ', listingDetails);
  //let results;
  try {
    let results = await mongodb.upsertProductDetails(listingDetails);
    //console.log('writeProposalMetadata result ', results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

//CONNECTIONS
async function getConnectionsList(req, res) {
    //let results;
    mongodb.readConnectionsList().then(async(cursor)=>{
        let results = [];
        cursor.on("data", data => console.log(data));
        cursor.stream().on("sdata", data => console.log(data));
        results = await cursor.toArray();
        res.send({
          fromCache: false,
          data: results,
        });
        await cursor.close();
    }).catch((error)=>{
        console.error(error);
        res.status(404).send("Data unavailable due to: "+error);
    }).finally(async()=>{

    });
}

async function getConnectionDetails(req, res) {
  const connectionId = req.params.connectionId;
  console.log('getConnectionDetails connectionId ', connectionId);
  //let results;
  try {
    if(connectionId === null || connectionId === '' ) throw "Expected connectionId parameter";
    let results = await mongodb.readConnectionDetails(connectionId.toString());

    console.log('results for ',connectionId,'eq', results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable due to "+error);
  }
}

async function upsertConnectionDetails(req, res) {
  const connectionDetails = req.body;
  console.log('upsertConnectionDetails connectionDetails ', connectionDetails);
  //let results;
  try {
    let results = await mongodb.upsertConnectionDetails(connectionDetails);
    //console.log('writeProposalMetadata result ', results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

//COMMENTS
async function getCommentsList(req, res) {
    //let results;
    mongodb.readCommentsList().then(async(cursor)=>{
        let results = [];
        cursor.on("data", data => console.log(data));
        cursor.stream().on("sdata", data => console.log(data));
        results = await cursor.toArray();
        res.send({
          fromCache: false,
          data: results,
        });
        await cursor.close();
    }).catch((error)=>{
        console.error(error);
        res.status(404).send("Data unavailable due to: "+error);
    }).finally(async()=>{

    });
}

async function getCommentDetails(req, res) {
  const commentId = req.params.commentId;
  console.log('getCommentDetails commentId ', commentId);
  //let results;
  try {
    if(commentId === null || commentId === '' ) throw "Expected commentId parameter";
    let results = await mongodb.readCommentDetails(commentId.toString());

    console.log('results for ',commentId,'eq', results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable due to "+error);
  }
}

async function upsertCommentDetails(req, res) {
  const commentsDetails = req.body;
  console.log('upsertCommentDetails productDetails ', commentsDetails);
  //let results;
  try {
    let results = await mongodb.upsertCommentDetails(commentsDetails);
    //console.log('writeProposalMetadata result ', results);
    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

function healthz(req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('Healthz up!');
}

app.use(cors());

app.get("/mfarmapi/", healthz);
app.get("/", healthz);

/** Get a list of summarized user info. */
app.get("/mfarmapi/userlist/", getUsersList);
/** Get detailed user info. */
app.get("/mfarmapi/userprofile/:userId", getUserProfile);
/** Write User details to db. */ //todo decide on how to create ids for new obj
app.post("/mfarmapi/userprofile/", upsertUserProfile);

/** Get a list of products. */
app.get("/mfarmapi/productlist/", getProductList);
/** Get detailed Product info. */
app.get("/mfarmapi/productdetails/:productId", getProductDetails);
/** Write Product details to db. */ //todo decide on how to create ids for new obj
app.post("/mfarmapi/productdetails/", upsertProductDetails);

/** Get a list of farms. */
app.get("/mfarmapi/farmlist/", getFarmList);
/** Get detailed farms info. */
app.get("/mfarmapi/farmdetails/:farmId", getFarmDetails);
/** Write farms details to db. */ //todo decide on how to create ids for new obj
app.post("/mfarmapi/farmDetails/", upsertFarmDetails);

/** Get a list of listing. */
app.get("/mfarmapi/listingslist/", getListingsList);
/** Get detailed Listing info. */
app.get("/mfarmapi/listingdetails/:listingId", getListingDetails);
/** Write Listing details to db. */ //todo decide on how to create ids for new obj
app.post("/mfarmapi/listingDetails/", upsertListingDetails);

/** Get a list of connections. */
app.get("/mfarmapi/connectionslist/", getConnectionsList);
/** Get detailed connection info. */
app.get("/mfarmapi/connectiondetails/:connectionId", getConnectionDetails);
/** Write Connection details to db. */ //todo decide on how to create ids for new obj
app.post("/mfarmapi/connectiondetails/", upsertConnectionDetails);

/** Get a list of comments. */
app.get("/mfarmapi/commentslist/", getConnectionsList);
/** Get detailed comment info. */
app.get("/mfarmapi/commentdetails/:comentId", getCommentDetails);
/** Write Connection details to db. */ //todo decide on how to create ids for new obj
app.post("/mfarmapi/commentdetails/", upsertCommentDetails);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// CORS config
const corsapp = express();
corsapp.use('/', createProxyMiddleware({
    target: `http://localhost:${port}/`,
    changeOrigin: true,
    secure: true, //enable cookies
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));
corsapp.listen(corsPort, () => {
  console.log(`Cors listening on port ${corsPort}`);
});

// HEALTH config
const happ = express();
happ.use('/healthz', healthz);
happ.use('/', healthz );

happ.listen(healthPort, () => {
  console.log(`health check running at port ${healthPort}`)
});
