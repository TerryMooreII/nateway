const Hapi = require('hapi');
const PubSub = require('pubsub-js');
const remotes = require('./nateway-hosts');


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

const parseHrtimeToSeconds = hrtime => (hrtime[0] + (hrtime[1] / 1000000)).toFixed(3); // ms

const startServer = async (msg = 'Starting Nateway') => {
  const startTime = process.hrtime();

  server = Hapi.server({
    host: 'localhost',
    port: 8000
  });
  try {
    await server.register({ plugin: require('h2o2') });
    await server.register({
      plugin: require('good'),
      options
    });
    await server.start();
    const ms = Math.floor(parseHrtimeToSeconds(process.hrtime(startTime)));
    console.log(`${msg} (${ms} ms):  ${server.info.uri}`);
  } catch (e) {
    console.log('Failed to load plugins');
  }
};

const configureRoutes = (services = new Map()) => {
  for (const [, data] of services) {
    const {
      protocol,
      host,
      port,
      uris
    } = data.endpoints;

    // eslint-disable-next-line
    uris.forEach((uri) => {
      server.route([
        {
          method: uri.method,
          path: `${uri.uri}`,
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
    });
  }
};

const restartServer = () => {
  server.stop({ timeout: 1000 }).then(() => {
    server = null;
    startServer('Routing table has been updated, restarting Nateway');
    configureRoutes(remotes);
  });
};

PubSub.subscribe('RESTART', restartServer);

startServer();
configureRoutes(remotes);
