const Hapi = require('hapi');
const hosts = require('./nateway-hosts');
const PubSub = require('pubsub-js');
const Helpers = require('../utils/helpers');

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 8001
});

const addHost = (request) => {
  const { payload } = request;
  // TODO: Validate the object
  if (!hosts.get(payload.name)) {
    console.log(`Adding Service ${payload.name}`);
    console.log(`${payload.name} contains the following routes: ${payload.endpoints.uris.join(', ')}`);
    hosts.set(payload.name, payload);
  }
};


// Add the route
server.route({
  method: 'POST',
  path: '/add',
  handler(request, h) {
    addHost(request);
    PubSub.publish('RESTART');
    return h.response().code(204);
  }
});

server.route({
  method: 'GET',
  path: '/apis',
  handler(request, h) {
    return h.response(Helpers.strMapToObj(hosts));
  }
});

// Start the server
async function start() {
  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Nateway Management running at:', server.info.uri);
}

start();
