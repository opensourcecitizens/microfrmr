const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Note: mongodb-memory-server was attempted but the environment couldn't
// start the mongod binary. Tests will mock Mongoose models instead.
