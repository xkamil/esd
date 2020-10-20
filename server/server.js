const express = require('express')
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const yaml = require('js-yaml');
const fs = require('fs');
const environment = process.env.ENVIRONMENT || 'test';

const app = express();
const config = yaml.safeLoad(fs.readFileSync(__dirname + `/../configuration/configuration-${environment}.yaml`))
const port = process.env.PORT || config.serverPort;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'))

const services = {}
const serviceInitialStatus = {
  status: null,
  statusDate: null,
  body: null,
  error: null
}

config.services.forEach(service => {
  services[service.name] = {
    name: service.name,
    healthUrl: service.health,
    metaUrl: service.meta,
    health: serviceInitialStatus,
    meta: serviceInitialStatus}
})

updateServicesStatus();
setInterval(updateServicesStatus, config.service.statusRefreshInterval);

app.get('/api/configuration', (req, res) => {
  res.json({
    environment: config.environment,
    statusRefreshInterval: config.service.statusRefreshInterval,
    services
  })
});

function updateServicesStatus() {
  config.services.forEach(service => {
    fetch(service.health, {timeout: config.service.statusRequestTimeout})
      .then(res => handleServiceResponse(service, 'health', res))
      .catch(error => handleServiceResponseError(service, 'health', error))

    fetch(service.meta, {timeout: config.service.statusRequestTimeout})
      .then(res => handleServiceResponse(service, 'meta', res))
      .catch(error => handleServiceResponseError(service, 'meta', error))
  })
}

function handleServiceResponse(service, responseType, res) {

  const newStatus = {
    status: res.ok ? 'OK' : `${res.status}`,
    error: null,
    statusDate: Date.now(),
    body: null
  }

  res.text()
    .then(textBody => newStatus.body = textBody)
    .then(textBody => newStatus.body = JSON.parse(textBody))
    .catch(() => newStatus.body = null)
    .then(() => services[service.name][responseType] = {...services[service.name][responseType], ...newStatus})
}

function handleServiceResponseError(service, responseType, error) {
  services[service.name][responseType] = {
    status: null,
    error: error.type,
    statusDate: Date.now(),
    body: error.message
  }
}

app.listen(port, () => console.log(`App listening on port ${port}!`));