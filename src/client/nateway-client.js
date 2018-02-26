const axios = require('axios');

const register = (config = {}) => {
  let promise;

  if (config.plugin) {
    promise = require(`${__dirname}/plugins/${config.plugin.name}`).run(config.plugin.config);
  } else {
    promise = new Promise([]);
  }

  promise
    .then((endpoints) => {
      config.service.endpoints = endpoints;
    })
    .then(() => {
      axios.post(`${config.nateway}/add`, config.service)
        .then(() => {
          console.log(`Notified Nateway of ${config.service.name}`);
        });
    });
};

module.exports = register;
