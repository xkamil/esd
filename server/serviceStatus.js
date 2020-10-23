const yaml = require('js-yaml');
const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');

const environment = process.env.ENVIRONMENT || 'test';
const config = yaml.safeLoad(fs.readFileSync(__dirname + `/../configuration/configuration-${environment}.yaml`))
const httpsAgent = new https.Agent({rejectUnauthorized: false});
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
    fetch(service.healthUrl, getFetchConfig(service.healthUrl))
      .then(res => handleServiceResponse(service, 'health', res))
      .catch(error => handleServiceResponseError(service, 'health', error))

    fetch(service.metaUrl, getFetchConfig(service.healthUrl))
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
    .catch(() => {
    })
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

function getFetchConfig(url) {
  const fetchConfig = {timeout: config.service.statusRequestTimeout};
  if (url.startsWith("https:")) {
    fetchConfig.agent = httpsAgent;
  }
  return fetchConfig;
}

module.exports = services;