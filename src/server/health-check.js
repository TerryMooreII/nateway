const axios = require('axios');
const hosts = require('./nateway-hosts');
const PubSub = require('pubsub-js');

const CHECK_INTERVAL = 5000;
const statusType = {
  UP: 'up',
  DOWN: 'down',
  DEGRADED: 'degraded'
}

const takeDown = (key) => {
  hosts.delete(key);
  PubSub.publish('RESTART');
}

const updateStatus = (name, data, status) => {
  if (data.status === statusType.DEGRADED){
    console.log('Down threshold reached.  Removing', name);
    takeDown(name)
    return;
  }
  
  if(status === statusType.DEGRADED){
    console.log(`${name} is Degraded`)
  }else{
    console.log(`${name} is Up`)
  }

  data = Object.assign(data, {status});
  hosts.set(name, data);
}

const runCheck = () => {
  hosts.forEach((data, name) => {
    axios.get(data.health)
    .then((response) => {
      if (response.status !== 200) {
        updateStatus(name, data, statusType.DEGRADED);
      }

      if (data.status === statusType.DEGRADED) {
        updateStatus(name, data, statusType.UP);
      }

    }).catch(() => {
      updateStatus(name, data, statusType.DEGRADED);
    }) 
  });
}

console.log('Starting Nateway Health Checker')
setInterval(runCheck , CHECK_INTERVAL);
