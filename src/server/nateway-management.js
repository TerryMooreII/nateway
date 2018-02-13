'use strict';

const Hapi = require('hapi');
const hosts = require('./nateway-hosts');
const PubSub = require('pubsub-js');

// Create a server with a host and port
const server = Hapi.server({ 
    host: 'localhost', 
    port: 8001
});

// Add the route
server.route({
    method: 'POST',
    path:'/add', 
    handler: function (request, h) {
        addHost(request);
        PubSub.publish('RESTART');
        return h.response().code(204);
    }
});

// Start the server
async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Nateway Management running at:', server.info.uri);
};

start();


const addHost = (request) => {
  const {payload} = request;
  
  // TODO: Validate the object
  if (!hosts.get(payload.name)) {
    console.log('Adding Service', payload.name)
    hosts.set(payload.name, payload);
  }
};