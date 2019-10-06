const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const db = require('../config/keys.js').mongoURI;
const models = require('./models');
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.log(err));

const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema.js');

app.use(bodyParser.json());

app.use('/graphql', expressGraphQL({ schema, graphiql: true }));

module.exports = app;