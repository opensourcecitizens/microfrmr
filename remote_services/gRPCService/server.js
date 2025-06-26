const grpc = require("@grpc/grpc-js");
const USERS_PROTO_PATH = "./protos/users.proto";
const protobuf = require('protobufjs');
var protoLoader = require("@grpc/proto-loader");
const serializer = require('proto3-json-serializer');

const args = require('minimist')(process.argv.slice(2));
const redisHost = args['redishost'] || 'localhost'
const redisPort = args['redisport'] || '6379'
const mongoServer = args['mongo_server'] || "mongodb://localhost:27017"
const port = args['port'] || 8099;
const corsPort = args['corsport'] || 8888;
const healthPort = args['healthport'] || 8899;
const crypto = require('crypto');
const DatabasePersist = require('./db_persists');
const mongodb = new DatabasePersist(mongoServer);

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
var packageDefinition = protoLoader.loadSync(USERS_PROTO_PATH, options);
const usersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
/*let users = {users:[
  { id: "1", name: "User 1", email: "Content 1", admin: true },
  { id: "2", name: "User 2", email: "Content 2", admin: false },
  { id: "3", name: "User 3" },
  { id: "4", name: "User 4" }
]};*/

server.addService(usersProto.UsersService.service, {
  getAllUsers: (_, callback) => {
      mongodb.readUsersList().then(async(cursor)=>{
          let results = [];
          results = await cursor.toArray();
          let remapped = results.map( (user) =>
          {
            return {id: user.id, name: user.name, email: user.email, admin: user.admin }
          });
          //todo add reduce to dedup results - return latest
          //console.log(results);
          callback(null, {users: remapped } );
          await cursor.close();
      }).catch((error)=>{
          console.error(error);
          callback(error, _  );
      }).finally(async()=>{

      });
  },

  //add other grpc service call here. For example ...
  getUser: (_, callback) => {
      let userId = _.request.id;
      console.log(userId);
      mongodb.readUserProfile(userId).then(async(results)=>{
          let remapped = results.map( (user) =>
          {
            return {id: user.id, name: user.name, email: user.email, admin: user.admin }
          });
          console.log(remapped);
          //todo add reduce to dedup results - return latest
          callback(null,  remapped && remapped.length>0? remapped[0]: {} );

      }).catch((error)=>{
          console.error(error);
          callback(error, _  );
      }).finally(async()=>{

      });
  },

  upsertUser: (_, callback) => {
    const root = protobuf.loadSync(USERS_PROTO_PATH);
    const User = root.lookupType('User');

    let user = _.request;
    console.log('userObject = ',user);
    console.log('User json  = ',User.fromObject(user));

    mongodb.upsertUserProfile(User.fromObject(user)).then(async(results)=>{
        console.log('results', results);
         let remapped;
        if(typeof results === Array ){
            remapped = results.map( (userRes) =>
            {
               return userRes;//{id: userRes.id, name: userRes.name, email: userRes.email, admin: userRes.admin }
            });
        } else {
            remapped = results;//{id: results.id, name: results.name, email: results.email, admin: results.admin };
        }
        console.log('remapped = ',remapped);
        //todo add reduce to dedup results - return latest
        //callback(null,  remapped && remapped.length>0? remapped[0]: {} );
        callback( null, { response: remapped } );
    }).catch((error)=>{
        console.error(error);
        callback(error, _  );
    }).finally(async()=>{

    });
  },

});

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start(); //note: 'start' is deprecated
  }
);