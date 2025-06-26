const { MongoClient } = require("mongodb");

const COLLECTION_VOTE_RECEIPTS = 'voteReceipts';
const COLLECTION_VOTING_POWER = 'votingPower';
const COLLECTION_TREASURY_RECEIPTS = 'treasuryReceipts';
const COLLECTION_PROPOSALS_LIST = 'proposalsList';
const COLLECTION_PROPOSAL_TRXNS = 'proposalTransactions';

const DB_NAME = 'micrfrmr_db';
const COLLECTION_COMMENTS = "comments";
const COLLECTION_CONNECTIONS = "connections";
const COLLECTION_LISTINGS = "listings";
const COLLECTION_FARMS = "farms";
const COLLECTION_PRODUCTS = "products";
const COLLECTION_USERS = "users";

const ERROR_CODE = "DB_100";


//https://www.mongodb.com/docs/drivers/node/current/usage-examples/replaceOne/
//https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateMany/
//https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/
var  mongoUrl = "mongodb://localhost:27017";
var client ;
class DatabasePersist {

    constructor (mongoServerUri){
        if(mongoServerUri){
            console.log("initialize mongoUrl=",mongoServerUri);
            mongoUrl = mongoServerUri;
        }
    }

    // assume db is open and collection exists,
    // parsedData is either jsonObject or jsonArray
     writeToDB (db, dbCollection, parsedData ){
        //const database = client.db("insertDB");
        //const haiku = database.collection("haiku");
        client = new MongoClient(mongoUrl);
        var result = null;
        if (Array.isArray(parsedData)) {
          console.log('It is a JSON array');
          result = dbCollection.insertMany(parsedData);
        } else if (typeof parsedData === 'object' && parsedData !== null) {
          console.log('It is a JSON object');
          result = dbCollection.insertOne(parsedData);
        }
        client.close();
        return result;
    }

    getMongoClient(){
        client = new MongoClient(mongoUrl);
        if( !client ){
            //client?.isConnected() was removed in v4
            //reopen client
            console.warn("Mongo client is not open. Please open!");
        }

        return client;
    }

    /////////////// PRODUCTS /////////////////////

    upsertProductDetails = async(timestamp, productObject )=>{
          var result;
          try{
              client = new MongoClient(mongoUrl);

              const database = client.db(DB_NAME);
              const productCollection = database.collection(COLLECTION_USERS);
              const doc = {
                            id:userObject.id,
                            type_id:productObject.type_id,
                            title:productObject.title,
                            update_timestamp:productObject.update_timestamp,
                            updated_by:productObject.updated_by,
                            expiration_timestamp:productObject.expiration_timestamp,
                            authorized_to:productObject.authorized_to,
                             };
              result = await productCollection.insertOne(doc);
          }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  upsertProductDetails error"+error);
         }finally{
            client.close();
         }
          return result;
    }

    readProductList = async()=>{
          var cursor;
          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const users = database.collection(COLLECTION_PRODUCTS);
              const query = {};
              const options = {
                  // Sort matched documents in descending order by update_timestamp
                  sort: { "update_timestamp": -1 },
                  // exclude only the `updated_by` , 'authorized_to', `expiration_timestamp` fields in the returned document
                  projection: { id: 1, type_id: 1, title: 1, update_timestamp: 1 },
              };

               cursor = await users.find(query, options);

                //todo wait for cursor to empty? - use a listener to close
                cursor.on('end', () => {
                      console.log('Cursor finished');
                      client.close();
                });
                cursor.on('error', (err) => {
                  console.error(err);
                  client.close();
                });
         }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  readProductList error"+error);
         }finally{
          //todo wait for cursor to empty? - use a listener to close
          //client.close();
         }

          return cursor;
    }

    readProductDetails = async(productId)=>{
          var oneRes;
          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const productCollection = database.collection(COLLECTION_PRODUCTS);
              const query = { id: productId };
              const options = {
                  // Sort matched documents in descending order by rating
                  sort: { "update_timestamp": -1 },
                  // Include only the `id`, `name`,'email', 'admin' fields in the returned document
                  projection: { id: 1, type_id: 1, title: 1, update_timestamp: 1, updated_by: 1,
                            expiration_timestamp: 1, authorized_to: 1 },
              };

              //const oneRes = await productCollection.findOne(query, options);
              const cursor = await productCollection.find(query, options).limit(1);
              oneRes = await cursor.toArray();
              cursor.close();
          }catch(error){
             console.error(error);
             throw Error(ERROR_CODE+"  readProductDetails error"+error);
          }finally{
             client.close();
          }

          return oneRes;
    }

    ///////////////// USERS ////////////////////////

    upsertUserProfile = async( userObject )=>{
          console.log('upsertUserProfile userObject =', userObject);
          var result;
          try{
              client = new MongoClient(mongoUrl);

              const database = client.db(DB_NAME);
              const createProposal = database.collection(COLLECTION_USERS);
              const doc = { update_timestamp:Date.now(), id:userObject.id,
                        name:userObject.name, email:userObject.email, admin:userObject.admin };
              console.log('upsertUserProfile doc =', doc);
              if(doc.id){
                result = await createProposal.updateOne( {id : doc.id},  {$set: doc} );
              } else{
                doc.id = Date.now();// todo create an id generator function
                result = await createProposal.insertOne(doc);
              }

              client.close();
          }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  upsertUserProfile error"+error);
          }finally{
            client.close();
          }
          return result;
    }

    readUsersList = async()=>{
        var cursor;
        try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const users = database.collection(COLLECTION_USERS);
              const query = {};
              const options = {
                  // Sort matched documents in descending order by rating
                  sort: { "name": -1 },
                  // Include only the `id` and `name` fields in the returned document
                  projection: { id: 1, name: 1, email: 1},
              };
              cursor = await users.find(query, options);

              //cursor.on("data", data => console.log(data));
              //cursor.stream().on("sdata", data => console.log(data));
              //todo wait for cursor to empty? - use a listener to close
              cursor.on('end', () => {
                    console.log('Cursor finished');
                    client.close();
              });
              cursor.on('error', (err) => {
                console.error(err);
                client.close();
              });
          }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  readUsersList error"+error);
          }finally{
          //todo wait for cursor to empty? - use a listener to close
          //client.close();
          }
          return cursor;
    }

    readUserProfile = async(userId)=>{
          var oneRes;

          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              var users = database.collection(COLLECTION_USERS);

              const query = { id: userId };

              const options = {
                  // Sort matched documents in descending order by natural _id
                  sort: { $natural: -1 },
                  // Include only the `id`, `name`,'email', 'admin' fields in the returned document
                  projection: { id: 1, name: 1, email: 1, admin: 1 },
              };

              var cursor  = users.find(query, options).limit(1);
              oneRes = await cursor.toArray();
              cursor.close();
          }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  readUserProfile error"+error);
          }finally{
            client.close();
          }
          return oneRes;
    }

    ///////////////////// FARMS ////////////////////////

    upsertFarmDetails = async(timestamp, farmObject )=>{
          var result;
          try{
              client = new MongoClient(mongoUrl);

              const database = client.db(DB_NAME);
              const farmCollection = database.collection(COLLECTION_FARMS);
              const doc = {
                            id:farmObject.id,
                            name:farmObject.name,
                            email:farmObject.email,
                            address:farmObject.address,
                            geoId:farmObject.geoId,
                            update_timestamp:farmObject.update_timestamp,
                            updated_by:farmObject.updated_by,
                            created_timestamp:farmObject.created_timestamp,
                            authorized_to:farmObject.authorized_to,
                             };
              result = await farmCollection.insertOne(doc);
          }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  upsertFarmDetails error"+error);
         }finally{
            client.close();
         }
          return result;
    }

    readFarmList = async()=>{
          var cursor;
          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const farmCollection = database.collection(COLLECTION_FARMS);
              const query = {};
              const options = {
                  // Sort matched documents in descending order by update_timestamp
                  sort: { "update_timestamp": -1 },
                  // exclude only the `updated_by` , 'authorized_to', `expiration_timestamp` fields in the returned document
                  projection: { id: 1, name: 1, address: 1, geoId: 1 },
              };
               cursor = await farmCollection.find(query, options);

                //todo wait for cursor to empty? - use a listener to close
                cursor.on('end', () => {
                      console.log('Cursor finished');
                      client.close();
                });
                cursor.on('error', (err) => {
                  console.error(err);
                  client.close();
                });
          }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  readProductList error"+error);
          }finally{
          //todo wait for cursor to empty? - use a listener to close
          //client.close();
          }

          return cursor;
    }

    readFarmDetails = async(productId)=>{
          var oneRes;
          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const productCollection = database.collection(COLLECTION_PRODUCTS);
              const query = { id: productId };
              const options = {
                  // Sort matched documents in descending order by rating
                  sort: { $natural: -1 },
                  // Include only the `id`, `name`,'email', 'admin' fields in the returned document
                  projection: { id: 1, name: 1, email: 1, phone: 1,address: 1, geoId:1,
                               update_timestamp: 1, updated_by: 1, expiration_timestamp: 1, authorized_to: 1 },
              };

              //const oneRes = await productCollection.findOne(query, options);
              const cursor = await productCollection.find(query, options).limit(1);
              oneRes = await cursor.toArray();
              cursor.close();
          }catch(error){
             console.error(error);
             throw Error(ERROR_CODE+"  readProductDetails error"+error);
          }finally{
             client.close();
          }

          return oneRes;
    }

    ///////////////////// LISTINGS ////////////////////////
    upsertListingDetails = async(timestamp, listingObject )=>{
          var result;
          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const listingCollection = database.collection(COLLECTION_LISTINGS);
              const doc = {
                    id:listingObject.id,
                    title:listingObject.title,
                    list_agent:listingObject.list_agent,
                    description:listingObject.description,
                    products:listingObject.products,
                    images:listingObject.images,
                    videos:listingObject.videos,
                    update_timestamp:listingObject.update_timestamp,
                    updated_by:listingObject.updated_by,
                    expiration_timestamp:listingObject.expiration_timestamp,
                    authorized_to:listingObject.authorized_to,
              };
              result = await listingCollection.insertOne(doc);
          }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  upsertListingDetails error"+error);
         }finally{
            client.close();
         }
         return result;
    }

    readListingsList = async()=>{
          var cursor;
          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const listingCollection = database.collection(COLLECTION_LISTINGS);
              const query = {};
              const options = {
                  // Sort matched documents in descending order by update_timestamp
                  sort: { "update_timestamp": -1 },
                  // exclude only the `updated_by` , 'authorized_to', `expiration_timestamp` fields in the returned document
                  projection: { id: 1, title: 1, products: 1, images: 1 },
              };
              cursor = await listingCollection.find(query, options);
              //todo wait for cursor to empty? - use a listener to close
              cursor.on('end', () => {
                      console.log('Cursor finished');
                      client.close();
              });

              cursor.on('error', (err) => {
                 console.error(err);
                 client.close();
              });

         }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  readListingList error"+error);
         }finally{
          //todo wait for cursor to empty? - use a listener to close
          //client.close();
         }

          return cursor;
    }

    readListingDetails = async(listingId)=>{
          var oneRes;
          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const productCollection = database.collection(COLLECTION_PRODUCTS);
              const query = { id: listingId };
              const options = {
                  // Sort matched documents in descending order by rating
                  sort: { $natural: -1 },
                  // Include only the `id`, `name`,'email', 'admin' fields in the returned document
                  projection: { id: 1, title: 1, listing_agent: 1, description: 1,products: 1, images:1, videos: 1,
                               update_timestamp: 1, updated_by: 1, expiration_timestamp: 1, authorized_to: 1 },
              };

              //const oneRes = await productCollection.findOne(query, options);
              const cursor = await productCollection.find(query, options).limit(1);
              oneRes = await cursor.toArray();
              cursor.close();
          }catch(error){
             console.error(error);
             throw Error(ERROR_CODE+"  readListingDetails error"+error);
          }finally{
             client.close();
          }

          return oneRes;
    }

    ///////////////////// CONNECTIONS ////////////////////////
    upsertConnectionDetails = async(timestamp, connectionObject )=>{
          var result;
          try{
              client = new MongoClient(mongoUrl);

              const database = client.db(DB_NAME);
              const connectionCollection = database.collection(COLLECTION_CONNECTIONS);
              const doc = {
                            id:connectionObject.id,
                            members:connectionObject.members,
                            update_timestamp:connectionObject.update_timestamp,
                            updated_by:connectionObject.updated_by,
                            authorized_to:connectionObject.authorized_to,
                             };
              result = await connectionCollection.insertOne(doc);
          }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  upsertConnectionDetails error"+error);
         }finally{
            client.close();
         }
          return result;
    }

    readConnectionsList = async()=>{
          var cursor;
          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const connectionCollection = database.collection(COLLECTION_CONNECTIONS);
              const query = {};
              const options = {
                  // Sort matched documents in descending order by update_timestamp
                  sort: { "update_timestamp": -1 },
                  // exclude only the `updated_by` , 'authorized_to', `expiration_timestamp` fields in the returned document
                  projection: { id: 1, members: 1 },
              };
               cursor = await connectionCollection.find(query, options);

                //todo wait for cursor to empty? - use a listener to close
                cursor.on('end', () => {
                      console.log('Cursor finished');
                      client.close();
                });
                cursor.on('error', (err) => {
                  console.error(err);
                  client.close();
                });
         }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  readConnectionsList error"+error);
         }finally{
          //todo wait for cursor to empty? - use a listener to close
          //client.close();
         }

          return cursor;
    }

    readConnectionDetails = async(connectionId)=>{
          var oneRes;
          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const connectionCollection = database.collection(COLLECTION_CONNECTIONS);
              const query = { id: connectionId };
              const options = {
                  // Sort matched documents in descending order by rating
                  sort: { $natural: -1 },
                  //
                  projection: { id: 1, members: 1,
                               update_timestamp: 1, updated_by: 1, authorized_to: 1 },
              };

              //const oneRes = await productCollection.findOne(query, options);
              const cursor = await connectionCollection.find(query, options).limit(1);
              oneRes = await cursor.toArray();
              cursor.close();
          }catch(error){
             console.error(error);
             throw Error(ERROR_CODE+"  readConnectionDetails error"+error);
          }finally{
             client.close();
          }

          return oneRes;
    }

    ///////////////////// COMMENTS ////////////////////////

    upsertCommentsDetails = async(timestamp, commentsObject )=>{
          var result;
          try{
              client = new MongoClient(mongoUrl);

              const database = client.db(DB_NAME);
              const commentsCollection = database.collection(COLLECTION_COMMENTS);
              const doc = {
                            id:commentsObject.id,
                            parentId:commentsObject.parentId,
                            category:commentsObject.category,
                            comment:commentsObject.comment,
                            from:commentsObject.from,
                            timestamp:commentsObject.timestamp,
                             };
              result = await commentsCollection.insertOne(doc);
          }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  upsertCommentsDetails error"+error);
         }finally{
            client.close();
         }
          return result;
    }

    readCommentsList = async()=>{
          var cursor;
          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const commentsCollection = database.collection(COLLECTION_COMMENTS);
              const query = {};
              const options = {
                  // Sort matched documents in descending order by update_timestamp
                  sort: { "timestamp": -1 },
                  //
                  projection: { id: 1, parentId: 1 , category: 1, comment: 1 },
              };
               cursor = await commentsCollection.find(query, options);

                //todo wait for cursor to empty? - use a listener to close
                cursor.on('end', () => {
                      console.log('Cursor finished');
                      client.close();
                });
                cursor.on('error', (err) => {
                  console.error(err);
                  client.close();
                });
         }catch(error){
            console.error(error);
            throw Error(ERROR_CODE+"  readCommentsList error"+error);
         }finally{
          //todo wait for cursor to empty? - use a listener to close
          //client.close();
         }

          return cursor;
    }

    readCommentsDetails = async(commentId)=>{
          var oneRes;
          try{
              client = new MongoClient(mongoUrl);
              const database = client.db(DB_NAME);
              const commentsCollection = database.collection(COLLECTION_COMMENTS);
              const query = { id: commentId };
              const options = {
                  // Sort matched documents in descending order by rating
                  sort: { $natural: -1 },
                  //
                  projection: { id: 1, parentId: 1,
                               category: 1, comment: 1, from: 1, timestamp: 1 },
              };

              //const oneRes = await productCollection.findOne(query, options);
              const cursor = await commentsCollection.find(query, options).limit(1);
              oneRes = await cursor.toArray();
              cursor.close();
          }catch(error){
             console.error(error);
             throw Error(ERROR_CODE+"  readCommentsDetails error"+error);
          }finally{
             client.close();
          }

          return oneRes;
    }

}//class

module.exports = DatabasePersist
