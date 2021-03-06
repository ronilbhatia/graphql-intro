// Express setup
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Connect to MongoDB via Mongoose ORM
const mongoose = require("mongoose");
const db = require('./config/keys').mongoURI;
const User = require('./models/User');
const Post = require('./models/Post');

// GraphQL setup
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('Succesfully connected to MongoDB'))
  .catch(err => console.log(err))

app.use(bodyParser.json());

app.use('/graphql', expressGraphQL({ schema, graphiql: true }));

app.listen(5000, () => console.log("Server is running on port 5000"));
