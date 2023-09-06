
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

app.post('/server', fsController.getArrayOfFilePaths, serverASTController.parseAll, (req, res) => {
  res.status(201).json(res.locals.serverRoutes);
})
// 'res.locals.serverOutput' Object shape:
// { '/api/': {
//     'GET': { 'Person': { 'name': 'String' } }, 
//     'POST': { 'Species': { 'type': 'String' } }
//   }, 
//   { '/api/homeworld': { 
//       'GET': { 'Person': 'String' } }
//   }
// }


app.get('/code', componentController.getCode, (req, res) => {
  console.log('res.locals', typeof res.locals.componentCode)
  res.status(200).json(res.locals.componentCode);
})

app.get('/', (req, res) => {
  res.status(404).send('Not Found');
});



// if (process.env.NODE_ENV === "development") {
//   app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
//   });
// }

module.exports = app;
