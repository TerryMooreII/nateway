const axios = require('axios');

const parser = (data) => {
  const [host, port] = data.host.split(':');
  const protocol = data.schemes[0];

  const api = {
    protocol,
    host,
    port,
    uris: []
  };

  // eslint-disable-next-line
  for (const uri in data.paths) {
    if (uri !== '/' && uri !== '/heartbeat') {
      // eslint-disable-next-line
      for (const method in data.paths[uri]) {
        api.uris.push({
          uri,
          method: method.toUpperCase()
        });
      }
    }
  }

  return api;
};

const request = config => axios.get(config.url)
  .then(response => parser(response.data));

const run = config => request(config);

// run({ url: 'http://localhost:3000/swagger.json' }).then(data => console.log(data));

module.exports = {
  run
};
