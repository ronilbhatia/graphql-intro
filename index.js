const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoose = require("mongoose");
const db = require('./config/keys').mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Succesfully connected to MongoDB'))
  .catch(err => console.log(err))

app.use(bodyParser.json());

app.get('/', (req, res) => res.send("Hello World"))

app.listen(5000, () => console.log("Server is running on port 5000"));