const { Client } = require('pg');
const pgCamelCase = require('pg-camelcase');

pgCamelCase.inject(require('pg'));

const dbclient = new Client();
dbclient.connect()

module.exports = dbclient;