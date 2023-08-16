const express = require('express');
const app = express();
// port will be listening on 3000
const port = 3000;
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
}));

const componentController = require('./controllers/componentController');

app.use(express.json());

app.get('/components', componentController.parseAll, (req, res) => {
  console.log('hello', res.locals.components);
  res.status(200).json(res.locals.components);
})



app.get('/', (req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
