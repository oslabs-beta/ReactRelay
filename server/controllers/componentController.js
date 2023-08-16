const fs = require('fs');
const path2 = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const componentController = {}

console.log('hehhyehehe')
componentController.parseAll = (req, res, next) => {
  console.log('hehhyehehe2')
  const projectPath = req.body.filePath;
  if (projectPath.length === 0) next();
  console.log(projectPath)
  console.log('PROJECT PATH', projectPath);
  let components = {};
  const listOfChildren = new Set();


  //dirPath is initially the root directory. This function recursively navigates
  //through this directory, passing each file path into arrayOfFiles, and eventually
  //returning this array
  const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);


    files.forEach((file) => {
      if (fs.statSync(path2.join(dirPath, file)).isDirectory()) {
        arrayOfFiles = getAllFiles(path2.join(dirPath, file), arrayOfFiles);
      } else {
        arrayOfFiles.push(path2.join(dirPath, file));
      }
    })
    return arrayOfFiles;
  }

  //readFileSync method of the fs module is used to grab all the code from 'filePath',
  //then the parse method in babel parser is used to create and return an AST version of
  //this file. plugins necessary to work with JSX and typescript.
  const parseFile = (filePath) => {
    const fileCode = fs.readFileSync(filePath, 'utf-8');
    return parser.parse(fileCode, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
  }

  //
  const traverseAST = (ast, filePath) => {

    //variables in closure so they persist as we traverse from node to node (these could probably also be declared between 'traverse' and 'enter')
    const potentialChildren = [];
    let children = {};
    let current = '';
    let isComponent = false;
    let mightBeComponent = false;
    const noWayThisWorksCache = {};

    //babel traverse used to traverse the passed in ast
    traverse(ast, {

      //for each node (i.e. 'path') in the 'ast', the 'enter' method will be invoked
      enter(path) {

        //check if we are in the global scope within the file (i.e. not nested). if so, we
        //should check if the previously traversed code block was a component
        if (path.parent.type === "Program") {

          //if the prev code block was a component, add the information from this component to the 'components' object
          if (current !== '' && isComponent) components[filePath] = { data: { label: current }, children: {...children}, id: filePath };

          potentialChildren.push(current);

          //reset component information whenever global space is re-entered
          children = {};
          current = '';
          isComponent = false;

          //if the first node in the next code block in the global space of not 1 of the following types, it cannot be a component (possibly not necessary. also, possibly don't need to include "ExpressionStatement")
          mightBeComponent = ((path.node.type === "VariableDeclaration" || path.node.type === "ClassDeclaration" || path.node.type === "FunctionDeclaration" || path.node.type === "ExpressionStatement" || path.node.type === "ExportDefaultDeclaration" || path.node.type === "ExportNamedDeclaration")) ? true : false;
        }

        //set 'current' to the first Identifier of a new code block if the following conditions are met (the name of the identifier being render is a special case used to itentify the root file. there is probably a better solution)
        if (path.isIdentifier() && (path.parent.type === "VariableDeclarator" || path.parent.type === "ClassDeclaration" || path.parent.type === "FunctionDeclaration" || path.node.name === "render") && current === '' && mightBeComponent) {
          current = path.node.name !== "render" ? path.node.name : "root";
        }

        //check for imported variables
        if (path.isIdentifier() && (path.parent.type === "ImportDefaultSpecifier" || path.parent.type === "ImportSpecifier")) {

          //assign relativePath to the RFP this variable is being imported from
          const relativePath = path.parentPath.parent.source.value

          //filter out non-local paths (filters out modules, etc.)
          if (relativePath.includes('./') || relativePath.includes('../')) {

            //grab the directory of this file
            const currDirectory = path2.dirname(filePath)

            //grab the absolute filepath of the imported file
            const afp = path2.resolve(currDirectory, relativePath);

            //grab the file path within the allFiles array that matches "afp" (this is necessary bc 'afp' might not have .js/.jsx/.ts/.tsx at the end of it)
            const componentAFP = allFiles.filter(file => file.includes(afp))[0];

            //add this imported variable as a key in potentialChildren array with its value being its AFP
            potentialChildren[path.node.name] = componentAFP;
          }
        }

        //this is an attempt to filter out false positives from test files
        if (mightBeComponent && path.isIdentifier() && path.node.name === "describe") mightBeComponent === false;

        //I'm blanking on what edge case this logic was necessary for, but it's essentially the same as the following conditional check
        if (path.isIdentifier() && (path.parent.type === "JSXExpressionContainer" || path.parentPath.parent.type === "JSXExpressionContainer") && Object.keys(potentialChildren).includes(path.node.name)) {
          isComponent === true;
          const newChildPath = potentialChildren[path.node.name];
          
          if (newChildPath) children[newChildPath] = null;
          listOfChildren.add(path.node.name);
        }

        //if the current node has a pattern that is consistently true for child JSX components, and it was deemed to be a potential child via navigating the import statements above, then we can add its file path to the children array for the current component
        if (path.isJSXIdentifier()) {
          isComponent = true;
          if (path.parentPath.parent.type === "JSXElement" && Object.keys(potentialChildren).includes(path.node.name)) {
            const newChildPath = potentialChildren[path.node.name];
          
            if (newChildPath) children[newChildPath] = null;

            //this was just used for logging purposes and probably isn't necessary
            listOfChildren.add(path.node.name)
          }
        }
      }
    })

    //if the component is exported in this way: "export const ComponentName = () => {...}", it might be the case that there is no code after the component code block, in which case we should check if the previous code block was a component 1 last time.
    if (current !== '' && isComponent) components[filePath] = { data: {label: current}, children: {...children}, id: filePath };
  }

  //path to project the root client directory of the project we are analyzing (***you need to change this to afp of w/e project you're analyzing***)
  //const projectPath = '/Users/cush572/Codesmith/TEST/ReacType/app/src' //'/Users/cush572/Codesmith/TEST/spearmint/src'  //'/Users/cush572/Codesmith/Week3/unit-7-react-redux/client'    //'/Users/cush572/Codesmith/Projects/ITERATION_PROJECT/fitness-tracker/src';

  //invoking above 'getAllFiles' function to grab an array of all files in 'projectPath', then filtering for only files that could be react components
  const allFiles = getAllFiles(projectPath).filter((file) => file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts'));

  console.log(allFiles);

  //iterate through array of files, convert each to AST, and invoke above function to traverse the AST
  allFiles.forEach((filePath) => {
    const ast = parseFile(filePath);
    // console.log('ast');
    traverseAST(ast, filePath);
  })

  //this logic attempts to reassign all children filePath keys to point to their respective filePath Object within the components object
  Object.values(components).forEach(component => {
    Object.keys(component.children).forEach(filePath => {

      component.children[filePath] = components[filePath];
    })
  })

  //convert values of children properties to array of Objects, rather than object of filePath keys where the value is the object

  Object.values(components).forEach(component => {
    // const arrayOfChildObjects = Object.values(component.children);
    const arrayOfChildFilePaths = Object.keys(component.children);

    component.children = arrayOfChildFilePaths;
  })

  //set root node to be the "root"
  const componentTree = components[path2.join(projectPath, 'index.js')]; //Object.keys(components).filter(component => !listOfChildren.has(component)) //&& Object.keys(components[component].children).length > 0) //components[Object.keys(components).filter(component => !listOfChildren.has(component) && Object.keys(components[component].children).length > 0)];

  console.log(components)
  res.locals.components = components
  next();



}

module.exports = componentController;