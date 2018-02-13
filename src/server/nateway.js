const Hapi = require('hapi');
const Wreck = require('wreck');
const PubSub = require('pubsub-js');
const remotes = require('./nateway-hosts');

let serve

const options = {
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        response: '*',
        log: '*'
      }]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
};

const startServer = async (msg = 'Starting Nateway') => {
  var startTime = process.hrtime();

  server = Hapi.server({ 
    host: 'localhost', 
    port: 8000 
  });
  try {
    await server.register({ plugin: require('h2o2') });
    await server.register({
      plugin: require('good'),
      options,
    }); 
    await server.start();
    const ms = Math.floor(parseHrtimeToSeconds(process.hrtime(startTime)))
    console.log(`${msg} (${ms} ms):  ${server.info.uri}`); 
  }
  catch(e) {
    console.log('Failed to load plugins');
  }
}

const parseHrtimeToSeconds = (hrtime) => {
  return (hrtime[0] + (hrtime[1] / 1000000)).toFixed(3); // ms
}

configureRoutes = (remotes = new Map()) => {
  for (const [name, data] of remotes) {
    const {protocol, host, port, paths} = data.endpoints;
    paths.forEach((path) => {
      server.route([
        {
          method: '*',
          path: '/' + path + '/{params*}',
          handler: {
            proxy: {
              host,
              port,
              protocol,
              passThrough: true,
              xforward: true
            }
          }
        }
      ]);
    })
  };
}

restartServer = () => {
  server.stop({ timeout: 1000 }).then((err) => {
    server = null;
    startServer('Routing table has been updated, restarting Nateway');
    configureRoutes(remotes);

  })
}

PubSub.subscribe('RESTART', restartServer);

startServer();
configureRoutes(remotes);
