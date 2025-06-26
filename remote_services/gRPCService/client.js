const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const USERS_PROTO_PATH = "./protos/users.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(USERS_PROTO_PATH, options);

const UsersService = grpc.loadPackageDefinition(packageDefinition).UsersService;

const usersClient = new UsersService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

module.exports = usersClient;