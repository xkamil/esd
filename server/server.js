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

const services = [];

config.services.forEach(serviceConfig => services.push({
    name: serviceConfig.name,
    healthUrl: serviceConfig.url + config.paths.health.default,
    metaUrl: serviceConfig.url + config.paths.meta.default,
  })
)

updateServicesStatus();
setInterval(updateServicesStatus, config.service.statusRefreshInterval);

function updateServicesStatus() {
  services.forEach(service => {

    fetch(service.healthUrl, {timeout: config.service.statusRequestTimeout})
      .then(res => handleServiceResponse(service, 'health', res))
      .catch(error => handleServiceResponseError(service, 'health', error))

    fetch(service.metaUrl, {timeout: config.service.statusRequestTimeout})
      .then(res => handleServiceResponse(service, 'meta', res))
      .catch(error => handleServiceResponseError(service, 'meta', error))
  })
}

function handleServiceResponse(service, responseType, res) {
  const newStatus = {
    statusCode: res ? res.status : null,
    statusOk: res ? res.ok : false,
    statusDate: Date.now(),
    error: null,
    body: null
  }

  res.text()
    .then(textBody => newStatus.body = textBody)
    .then(textBody => newStatus.body = JSON.parse(textBody))
    .catch(() => {})
    .then(() => service[responseType] = {...service[responseType], ...newStatus})
}

function handleServiceResponseError(service, responseType, error) {
  service[responseType] = {
    statusCode: null,
    statusOk: false,
    error: error.type,
    statusDate: Date.now(),
    body: error.message
  }
}

app.get('/api/configuration', (req, res) => {
  res.json({
    environment: config.environment,
    statusRefreshInterval: config.service.statusRefreshInterval,
    services
  })
});

app.listen(port, () => console.log(`App listening on port ${port}!`));