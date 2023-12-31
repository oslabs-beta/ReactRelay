const fs = require('fs');
const path = require('path');

const fsController = {};

fsController.getArrayOfFilePaths = (req, res, next) => {
  const projectPath = req.body.filePath;
  if (projectPath.length === 0) next();

  //dirPath is initially the root directory. This function recursively navigates
  //through this directory, passing each file path into arrayOfFiles, and eventually
  //returning this array
  const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);


    files.forEach((file) => {
      if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
        arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
      } else {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    })
    return arrayOfFiles;
  }

  //invoking above 'getAllFiles' function to grab an array of all files in 'projectPath', then filtering for only files that could be react components
  const allFiles = getAllFiles(projectPath).filter((file) => file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts'));

  console.log('af', allFiles);
  res.locals.allFiles = allFiles;
  return next();

}

module.exports = fsController;