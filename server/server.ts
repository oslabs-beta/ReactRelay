
const express = require('express');
const app = express();
// port will be listening on 3000
const port = 3000;
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
}));

const fsController = require('./controllers/fsController');
const componentController = require('./controllers/componentController');
const serverASTController = require('./controllers/serverASTController');

app.use(express.json());

app.post('/components', fsController.getArrayOfFilePaths, componentController.parseAll, (req, res) => {
  // console.log('hello', res.locals.components);
  res.status(201).json(res.locals.components);
})

// app.post('/components', fsController.getArrayOfFilePaths, serverASTController.parseAll, (req, res) => {
//   res.status(201).json({})
// })


app.get('/', (req, res) => {
  res.status(404).send('Not Found');
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
