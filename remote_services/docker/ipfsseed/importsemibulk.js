'use strict';

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const args = require('minimist')(process.argv.slice(2));
const ipfproxyws = args['ipfsproxy']?args['ipfsproxy']:'ws://localhost:7071'
const dirPath = "../ipfsseed/samples"

console.log("args ipfproxyws -> ipfproxyws: "+ipfproxyws);
console.log("args dirPath : "+dirPath);

  var files = fs.readdirSync(dirPath);
  for ( var file of files ) {


const ws = new  WebSocket(ipfproxyws+'/persist',{
  perMessageDeflate: false
});

ws.on('open', function open() {
  //ws.send('something');
  //ws.send('QmX7epzCn2jD8nPUDiehmZDQs69HxKYcmMGjd3rmnjd2Ht');
  //read directory
  console.log('on open');

    //read images and send binary
    console.log('found image path: %s',file);
    const data = fs.readFileSync(dirPath+'/'+file);
    ws.send(data);

});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});

ws.on('error', function(error) {
    console.log(ws.id + ':' + error)
})

  }

