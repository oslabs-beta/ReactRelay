


//BREAKDOWN
//1. IDENTIFY FILE TYPE AS EITHER: 1) SERVER.JS 2) ROUTER 3) CONTROLLER 4) MODEL
//2. PASS FILE INTO ANOTHER TRAVERSAL FUNCTION SPECIFIC FOR THAT FILE TYPE
//3. PASS FILE INFORMATION INTO OBJECT SPECIFIC TO THAT FILE TYPE
//4. ITERATE THROUGH FILE OBJECTS ONE AT A TIME IN THE ORDER SHOWN ABOVE IN STEP 1. USE THIS INFORMATION TO GRADUALLY BUILD AN OUTPUT OBJECT CONTAINING INFORMATION ABOUT EACH ROUTE.

//SERVER.JS LOGIC
//-LOOK FOR IMPORTED FILES THAT ARE INCLUDED IN ARRAY OF ALL SERVER FILES
    //DETERMINE AFP AND SAVE THIS AFP ALONG WITH THE VARIABLE NAME IT IS IMPORTED AS
//-ALSO IDENTIFY THE LABEL OF EXPRESS INSTANCE
//-WHEN 'USE' METHOD IS INVOKED ON EXPRESS INSTANCE, AND FIRST ARG IS A ROUTE:
  //IF 2ND ARG IS THE EXACT MATCH OF ONE OF THE IMPORT LABELS, IT MUST BE A ROUTER (?)

//-WHEN CRUD METHOD IS INVOKED ON EXPRESS INSTANCE, FIRST ARG SHOULD BE COMPLETE ROUTE, FOLLOWED BY INDEFINITE NUMBER OF CONTROLLER INVOCATIONS. WE CAN CHECK IF THE FOLLOWING ARG SPLIT ON '.' IS INCLUDED IN IMPORT LABELS. IF SO, ADD IT TO OBJECT
  //-THERE MAY BE LOGIC TO GET/POST/ETC DATA TO/FROM DB MODEL INSIDE SERVER.JS, EITHER AFTER MIDDLEWARE OR IN PLACE OF IT. 
    //-FIRST WORK ON TAKING CARE OF LOGIC INVOLVING DB CALLS FROM MIDDLEWARE


//ROUTER LOGIC
//-DISTINGUISHING FEATURE = IMPORTING EXPRESS, THEN CREATING EXPRESS.ROUTER() INVOCATION (?)
//

//CONTROLLER LOGIC
//-DISTINGUISHING FEATURE = USING REQ, RES, NEXT, BUT NOT IMPORTING/INVOKING EXPRESS (?)
  //ALSO FILE PATH CAN BE MATCHED WITH MIDDLEWARE FOUND IN SERVER.JS/ROUTER FILES
//CHECK IMPORTS FROM LOCAL FILES (SHOULD INCLUDE ANY MODELS) AND SAVE THE VARIABLE NAMES
//IF DB MANIPULATION METHOD IS INVOKED ON ONE OF THESE VARIABLES, SAVE THE RELEVANT INFO IN OBJECT


//DB LOGIC
//FEATURES: IMPORTING MONGOOSE AND CREATING SCHEMA INSTANCE AND INVOKING CONNECT
//CHALLENGE = GRABBING SCHEMA DATA. POTENTIALLY WILL HAVE TO USE FS MODULE INSTEAD OF AST

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const { isIdentifier, isStringLiteral } = require('typescript');
const traverse = require('@babel/traverse').default;

const CRUDMETHODS = ['get', 'post', 'patch', 'put', 'delete'];

const serverASTController = {};

serverASTController.parseAll = (req, res, next) => {

  const routesObj = {};
  const routesArray = [];

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

  const findVariableName = (curr) => {
    const varDecPath = curr.findParent(curr => curr.isVariableDeclarator());
    return varDecPath.node.id.name;
  }

  const findImportLabel = (curr) => {
    const importDecPath = curr.findParent(curr => curr.isImportDeclaration());
    return importDecPath.node.specifiers[0].local.name;
  }

  const mapControllerPath = (instance, output) => {
    const method = curr.parent.property.name;
    const callExpPath = curr.findParent(curr => curr.isCallExpression());
    const arguments = callExpPath.node.arguments;
    const route = arguments[0].value;
    arguments.slice(1,-1).forEach(arg => {
      if (Object.hasOwn(importLabels, arg.object.name)) {
        const middlewareMethod = { method, [importLabels[arg.object.name]]: arg.property.name }
        controllerPaths[route] ? controllerPaths[route].push(middlewareMethod) : controllerPaths[route] = null//[middlewareMethod]
      }
    })
  }

  const traverseServerAST = (ast, filePath) => {
    let importExpress = false;
    let importMongoose = false;
    let expressLabel;
    let mongooseLabel;
    let expressInstance;
    let routerInstance;
    let schemaInstance;

    traverse(ast, {

      enter(curr) {

        if (expressInstance || routerInstance || schemaInstance) return;

        if (curr.isIdentifier() && curr.node.name === "require" && curr.parent.type === "CallExpression") {
          const argument = curr.parent.arguments[0];
           if (argument.type === "StringLiteral") {
            if (argument.value === "express") importExpress = true;
            if (argument.value === "mongoose") importMongoose = true;
           } else if (argument.type === "TemplateLiteral") {
            if (argument.quasis[0].value.raw === "express") importExpress = true;
            if (argument.quasis[0].value.raw === "mongoose") importMongoose = true;

           }
           if (importExpress || importMongoose) {
            const label = findVariableName(curr);
            importExpress ? expressLabel = label : mongooseLabel = label;
            console.log(expressLabel, 'expressLabel');
            importExpress = importLabel = false;
           }

        }

        if (curr.isStringLiteral() && (curr.node.value === "mongoose" || curr.node.value === "express") && curr.parent.type === "ImportDeclaration") {
          console.log('aaaajlkfajsf;')
          if (curr.node.value === "mongoose") {
            importMongoose = true;
            mongooseLabel = curr.parent.specifiers[0].local.name;
          }
          if (curr.node.value === "express") {
            importExpress = true;
            expressLabel = curr.parent.specifiers[0].local.name;
          }
          importExpress = importMongoose = false;
        }

        if (curr.isIdentifier() && curr.node.name === expressLabel && curr.parent.type === "CallExpression" && curr.parent.arguments.length === 0) {
          expressInstance = findVariableName(curr);
          console.log('expinst', expressInstance)
          traverseServerFile(ast, filePath, expressLabel, expressInstance);
        }

        if (curr.isIdentifier() && curr.node.name === expressLabel && curr.parent.type === "MemberExpression" && curr.parent.property.name === "Router") {
          routerInstance = findVariableName(curr);
          console.log('routerInstance', routerInstance);
          traverseRouterFile(ast, filePath, expressLabel, routerInstance);
        }

        if (curr.isIdentifier() && curr.node.name === mongooseLabel && curr.parent.type === "MemberExpression") {
          if (curr.parent.property.name === "Schema") {
            schemaInstance = findVariableName(curr);
            console.log('whyyyyyyyy')
            traverseMongooseFile(ast, filePath, mongooseLabel, schemaInstance);
          }
        }


      }

    })
    if (!expressInstance && !routerInstance && !schemaInstance) traverseControllerFile(ast, filePath);
  }

  const linksToRouter = {};
  const controllerPaths = {};

  const traverseServerFile = (ast, filePath, expressLabel, expressInstance) => {
    const importLabels = {};

    traverse(ast, {
      enter(curr) {

        if (curr.isStringLiteral() && curr.node.value.includes('./') && curr.parent.type === "ImportDeclaration") {
          const importLabel = findImportLabel(curr);

          //grab the directory of this file
          const currDirectory = path.dirname(filePath)

          //grab the absolute filepath of the imported file
          const afp = path.resolve(currDirectory, curr.node.value);

          console.log('afp', afp)

          const afpArray = allFiles.filter(file => file.includes(afp));
          if (afpArray.length) importLabels[importLabel] = afpArray[0];
          console.log(importLabels, 'importLabels');
        }

        if (curr.isIdentifier() && curr.node.name === expressInstance && curr.parent.type === "MemberExpression" && curr.parent.property.name === "use") {
          const callExpPath = curr.findParent(curr => curr.isCallExpression());
          const arguments = callExpPath.node.arguments;
          // console.log('y not in b', arguments.length, 'import labels', importLabels)
          if (arguments.length > 1 && Object.hasOwn(importLabels, arguments[1].name)) {
            console.log('we in dis b')
            linksToRouter[importLabels[arguments[1].name]] = arguments[0].value;
          }
        }

        if (curr.isIdentifier() && curr.node.name === expressInstance && curr.parent.type === "MemberExpression" && CRUDMETHODS.includes(curr.parent.property.name)) {
          const method = curr.parent.property.name;
          const callExpPath = curr.findParent(curr => curr.isCallExpression());
          const arguments = callExpPath.node.arguments;
          const route = arguments[0].value;
          arguments.slice(1,-1).forEach(arg => {
            if (Object.hasOwn(importLabels, arg.object.name)) {
              const middlewareMethod = { method, [importLabels[arg.object.name]]: arg.property.name }
              controllerPaths[route] ? controllerPaths[route].push(middlewareMethod) : controllerPaths[route] = [middlewareMethod]
            }
          })
        }


      }

    })
    console.log(linksToRouter, 'linksToRouter', controllerPaths, 'controllerPaths')
    
  }

  const routerPathExtensions = {};

  const traverseRouterFile = (ast, filePath, expressLabel, routerInstance) => {

    traverse(ast, {
      enter(curr) {

        if (curr.isIdentifier() && curr.node.name === routerInstance && curr.parent.type === "MemberExpression" && CRUDMETHODS.includes(curr.parent.property.name)) {
          mapControllerPath(routerInstance, routerPathExtensions);
        }




      }
    })



    return;

  }

  const traverseControllerFile = (ast, filePath, label, instance) => {
    return;

  }

  const schemas = {};
  const schemaKey = {};

  const traverseMongooseFile = (ast, filePath, mongooseLabel, schemaInstance) => {
    
    console.log('hey.........')

    traverse(ast, {
      enter(curr) {

        //check for new schema instances
        if (curr.isIdentifier() && curr.node.name === schemaInstance && curr.parent.type === "NewExpression") {
          const propsArray = curr.parent.arguments[0].properties;
          const schemaName = findVariableName(curr)

          const populateSchema = (propsArray) => {
            const output = {};
            propsArray.forEach(prop => {
              const key = prop.key.name;
              prop.value.type === "Identifier" ? output[key] = prop.value.name : (prop.value.type === "StringLiteral" || prop.value.type === "BooleanLiteral") ? output[key] = prop.value.value : prop.value.type === "ObjectExpression" ? output[key] = populateSchema(prop.value.properties) : prop.value.type === "ArrayExpression" ? output[key] = prop.value.elements.map(obj => populateSchema(obj.properties)) : output[key] = "UNKOWN VALUE";
            })
            return output;
          }
          schemas[schemaName] = populateSchema(propsArray)
          console.log('schemas', schemas)
        }

        if (curr.isIdentifier() && curr.node.name === mongooseLabel && curr.parent.type === "MemberExpression" && curr.parent.property.name === "model") {
          const callExpPath = curr.findParent(curr => curr.isCallExpression());
          let schemaExport;
          if (Object.hasOwn(schemas, callExpPath.node.arguments[1].name)) {
            const schemaExport = findVariableName(curr);
            schemaKey[schemaExport] = schemas[callExpPath.node.arguments[1].name];
          }
        }


      }
    })
    console.log(schemaKey, 'schemaKey');
    return
  }





  const allFiles = res.locals.allFiles;

  //iterate through array of files, convert each to AST, and invoke above function to traverse the AST
  allFiles.forEach((filePath) => {
    const ast = parseFile(filePath);
    // console.log('ast');
    traverseServerAST(ast, filePath);
  })

  next();
}

module.exports = serverASTController;