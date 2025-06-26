const protobuf = require('protobufjs');
var protoLoader = require("@grpc/proto-loader");
const USERS_PROTO_PATH = "../protos/users.proto";


const root = protobuf.loadSync(USERS_PROTO_PATH);
const User = root.lookupType('User');
const umessage = User.fromObject({ id: "2", name: "User 2", email: "Content 2", admin: false });
console.log(umessage);
const UsersList = root.lookupType('UsersList');
const lmessage = UsersList.fromObject({users:[{ id: "2", name: "User 2", email: "Content 2", admin: false }]});
console.log(lmessage);

//UsersList = root.lookupType('UsersList');
const message = UsersList.fromObject(users);
console.log(message);