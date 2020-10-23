const express = require('express');
const bodyParser = require('body-parser');
const services = require('./serviceStatus.js');
const yaml = require('js-yaml');
const fs = require('fs');

const environment = process.env.ENVIRONMENT || 'test';
const app = express();
const config = yaml.safeLoad(fs.readFileSync(__dirname + `/../configuration/configuration-${environment}.yaml`))
const port = process.env.PORT || config.serverPort;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/api/configuration', (req, res) => {
  res.json({
    environment: config.environment,
    statusRefreshInterval: config.service.statusRefreshInterval,
    services
  })
});

app.listen(port, () => console.log(`App listening on port ${port}!`));