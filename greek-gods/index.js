const app = require('./server/server.js');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  `Server is listening on Port ${port}`;
});