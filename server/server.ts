const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');

// starting out with all of the various methods
app.use(cors());
app.post(bodyParser.json());
app.post(bodyParser.urlencoded({ extended: true }));

// test for a get request
app.get('/', (req, res) => {
  res.send('the get request is working :D');
});

// test for a post request
app.post('/', (req, res) => {
  res.send('the post request is working :D');
});

// test for a put request
app.put('/', (req, res) => {
  res.send('the put request is working :D');
});

// test for a delete request
app.delete('/', (req, res) => {
  res.send('the delete request is working :D');
});

// creating a catch-all for routes which aren't found
app.get('/', (req, res) => {
  res.status(404).send('That file or path does not exist!');
});

// creating a global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// sending a message to the console to confirm that the server is running
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
