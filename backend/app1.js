const express = require('express');
const proxy = require('express-http-proxy');
const logger = require('morgan');
const nodes = require('./nodes.js');


var app = express();
app.use(express.static('../dist'));
app.set('port', (process.env.PORT || 5000));

app.get('/api/nodes', nodes.handler);

app.listen(app.get('port'), function() {
  console.log('Listening on port', app.get('port'));
});
