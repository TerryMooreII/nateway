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
    const path = uri.split('/')[1];
    if (uri !== '/' && uri !== '/heartbeat' && api.uris.indexOf(path) === -1) {
      api.uris.push(path);
    }
  }

  return api;
};

const request = config => axios.get(config.url)
  .then(response => parser(response.data));

const run = config => request(config);

module.exports = {
  run
};
