const axios = require('axios');

const config = {
  nateway: 'http://localhost:8001',
  service: {
    name: 'Mapping',
    health: 'http://localhost:3001/heartbeat',
    endpoints: null
  }
};

const swaggerParser = (data) => {
  const [host, port] = data.host.split(':');
  const protocol = data.schemes[0];

  const api = {
    protocol,
    host,
    port,
    paths: []
  };

  for (const uri in data.paths) {
    const path = uri.split('/')[1];
    if (uri !== '/' && uri !== '/heartbeat' && api.paths.indexOf(path) === -1) {
      api.paths.push(path);
    }
  }

  return api;
};

const getSwaggerConfig = () => axios.get('http://localhost:3001/swagger.json')
  .then(response => swaggerParser(response.data));

const register = () => {
  getSwaggerConfig()
    .then((swagger) => {
      config.service.endpoints = swagger;
    })
    .then(() => {
      axios.post(`${config.nateway}/add`, config.service)
        .then(() => {
          console.log(`Notified Nateway of ${config.service.name}`);
        });
    });
};

module.export = register(config);
