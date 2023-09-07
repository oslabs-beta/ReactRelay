//BREAKDOWN
//1. IDENTIFY FILE TYPE AS EITHER: 1) SERVER.JS 2) ROUTER 3) CONTROLLER 4) MODEL
//2. PASS FILE INTO ANOTHER TRAVERSAL FUNCTION SPECIFIC FOR THAT FILE TYPE
//3. PASS FILE INFORMATION INTO OBJECT SPECIFIC TO THAT FILE TYPE
//4. ITERATE THROUGH FILE OBJECTS ONE AT A TIME IN THE ORDER SHOWN ABOVE IN STEP 1. USE THIS INFORMATION TO GRADUALLY BUILD AN OUTPUT OBJECT CONTAINING INFORMATION ABOUT EACH ROUTE.

//SERVER.JS LOGIC
//-LOOK FOR IMPORTED FILES THAT ARE INCLUDED IN ARRAY OF ALL SERVER FILES
//DETERMINE AFP (ABSOLUTE FILES PATH) AND SAVE THIS AFP ALONG WITH THE VARIABLE NAME IT IS IMPORTED AS
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
// const { isIdentifier, isStringLiteral } = require('typescript');
const traverse = require('@babel/traverse').default;

const CRUDMETHODS = ['get', 'post', 'patch', 'put', 'delete'];

const serverASTController = {};

serverASTController.parseAll = (req, res, next) => {

  //readFileSync method of the fs module is used to grab all the code from 'filePath',
  //then the parse method in babel parser is used to create and return an AST version of
  //this file. plugins necessary to work with JSX and typescript.
  const parseFile = (filePath) => {
    const fileCode = fs.readFileSync(filePath, 'utf-8');
    return parser.parse(fileCode, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
  };

  //helper functions
  const findVariableName = (curr) => {
    const varDecPath = curr.findParent((curr) => curr.isVariableDeclarator());
    if (!varDecPath) return;
    if (varDecPath.node.id.name) return varDecPath.node.id.name;
    if (varDecPath.node.id.properties)
      return varDecPath.node.id.properties.map((prop) => prop.value.name);
  };

  const findImportLabel = (curr) => {
    const importDecPath = curr.findParent((curr) => curr.isImportDeclaration());
    return importDecPath.node.specifiers[0].local.name;
  };

  const addES6Import = (curr, filePath, importLabels) => {
    const importLabel = findImportLabel(curr); //grab the directory of this file
    const currDirectory = path.dirname(filePath); //grab the absolute filepath of the imported file //IRENE: using directory name of current filepath
    const afp = path.resolve(currDirectory, curr.node.value);
    console.log('afp', afp);
    const afpArray = allFiles.filter((file) => file.includes(afp)); //if imported file exists in server directory, add its label name as a key in importLabels obj w value being its afp
    if (afpArray.length) importLabels[importLabel] = afpArray[0];
    // console.log(importLabels, 'importLabels');  // importLabels = {starWarsController: /Users/Codesmith/App/Controllers/starWarsControllers.js} this is temporary
    return importLabels;
  };

  addES5Import = (curr, filePath, importLabels) => {
    const importLabel = findVariableName(curr);
    const currDirectory = path.dirname(filePath);
    const afp = path.resolve(currDirectory, curr.node.value);

    const afpArray = allFiles.filter((file) => file.includes(afp));
    if (afpArray.length) importLabels[importLabel] = afpArray[0];
    // console.log(importLabels, 'importLabels')
    return importLabels;
  };

  //traverse all server files and categorize them as either DB model files, controller files, router files, or the root server file
  const traverseServerAST = (ast, filePath) => {
    let importExpress = false;
    let importMongoose = false;
    let expressLabel;
    let mongooseLabel;
    let expressInstance;
    let routerInstance;
    let schemaInstance;
    let explicitRouter = false;

    traverse(ast, {
      enter(curr) {

        //check for specific ES5 syntax imports so we can identify 1) that express, mongoose, and/or express Router is being imported, and 2) what the import is labeled
        if (
          curr.isIdentifier() &&
          curr.node.name === 'require' &&
          curr.parent.type === 'CallExpression'
        ) {
          const argument = curr.parent.arguments[0];
          if (argument.type === 'StringLiteral') {
            if (argument.value === 'express') importExpress = true;
            if (argument.value === 'mongoose') importMongoose = true;
          } else if (argument.type === 'TemplateLiteral') {
            if (argument.quasis[0].value.raw === 'express')
              importExpress = true;
            if (argument.quasis[0].value.raw === 'mongoose')
              importMongoose = true;
          }
          if (importExpress || importMongoose) {
            const label = findVariableName(curr);
            label === 'express'
              ? (expressLabel = label)
              : importMongoose
              ? (mongooseLabel = label)
              : null;
            // console.log(expressLabel, 'expressLabel');
            importExpress = importLabel = false;
          }
        }

        //Same logic as above, but for ES6 syntax. TODO: account for possiblity of an import being imported "as" something. i.e.: import { Router as Routeriffic } from 'express'
        if (
          curr.isStringLiteral() &&
          (curr.node.value === 'mongoose' || curr.node.value === 'express') &&
          curr.parent.type === 'ImportDeclaration'
        ) {
          if (curr.node.value === 'mongoose') {
            importMongoose = true;
            mongooseLabel = curr.parent.specifiers[0].local.name;
          }
          if (curr.node.value === 'express') {
            if (curr.parent.specifiers.length >= 1) {
              for (let specifier of curr.parent.specifiers) {
                if (specifier.local.name === 'Router') {
                  explicitRouter = true;
                  importExpress = true;
                  expressLabel = "express";
                  return;
                }
              }
            }
            importExpress = true;
            expressLabel = curr.parent.specifiers[0].local.name;
          }
          importExpress = importMongoose = false;
        }

        //if it is found that an instance of express has been created, it is assumed this must be the root server file, and so the function for traversing root server files is invoked, and the current traversal is stopped.
        if (
          curr.isIdentifier() &&
          curr.node.name === expressLabel &&
          curr.parent.type === 'CallExpression' &&
          curr.parent.arguments.length === 0
        ) {
          expressInstance = findVariableName(curr);
          // console.log('expinst', expressInstance)
          traverseServerFile(ast, filePath, expressLabel, expressInstance);
          curr.stop();
        }

        //if it is found that a Router instance has been created, it is assumed this must be a router file, and so the func for traversing router files is invoked
        if (
          curr.isIdentifier() &&
          curr.node.name === expressLabel &&
          curr.parent.type === 'MemberExpression' &&
          curr.parent.property.name === 'Router'
        ) {
          routerInstance = findVariableName(curr);
          // console.log('routerInstance', routerInstance);
          traverseRouterFile(ast, filePath, expressLabel, routerInstance);
          curr.stop();
        }

        //extension of above to cover possibility of Router being explicitly imported as itself (ES6)
        if (
          curr.isIdentifier() &&
          explicitRouter &&
          curr.node.name === 'Router' &&
          curr.parent.type === 'CallExpression'
        ) {
          const varDecPath = curr.findParent(curr => curr.isVariableDeclarator());
          if (varDecPath) {
            if (varDecPath.node.id) {
              routerInstance = varDecPath.node.id.name;
              traverseRouterFile(ast, filePath, expressLabel, routerInstance);
              curr.stop();
            }
          }
        }

        //if a mongoose Schema instance is found, assume this file is a models file
        if (
          curr.isIdentifier() &&
          curr.node.name === mongooseLabel &&
          curr.parent.type === 'MemberExpression'
        ) {
          if (curr.parent.property.name === 'Schema') {
            schemaInstance = findVariableName(curr);
            traverseMongooseFile(ast, filePath, mongooseLabel, schemaInstance);
            curr.stop();
          }
        }

      },
    });
    //if file was not identified as root, router, or model file, assume it is either a controller file, or negligible
    if (!expressInstance && !routerInstance && !schemaInstance)
      traverseControllerFile(ast, filePath);
  };

  const linksToRouter = {};
  const allServerRoutesLeadingToController = {}; //obj to hold all server routes that lead to a controller
  //TODO: STILL NEED TO ACCOUNT FOR MIDDLEWARE FUNCTIONALITY EXPLICITLY FOUND IN THE ROOT SERVER FILE (DB INTERACTIONS THAT OCCUR IN ROOT SERVER FILE)

  //function for traversing the root server file, checking for links to router and controller files
  const traverseServerFile = (ast, filePath, expressLabel, expressInstance) => {
    //used to store identified imports and their corresponding AFP
    let importLabels = {};

    traverse(ast, {
      enter(curr) {
        //check for files imported locally using ES6 syntax
        if (
          curr.isStringLiteral() &&
          curr.node.value.includes('./') &&
          curr.parent.type === 'ImportDeclaration'
        ) {
          importLabels = addES6Import(curr, filePath, importLabels);
        }

        //check for files imported locally using ES5 syntax
        if (
          curr.isStringLiteral() &&
          curr.node.value.includes('./') &&
          curr.parent.type === 'CallExpression'
        ) {
          if (curr.parent.callee.name === 'require') {
            importLabels = addES5Import(curr, filePath, importLabels);
          }
        }

        //filter for invocations of the use method on the express instance (app.use(...)), and identify links to router files using this
        if (
          curr.isIdentifier() &&
          curr.node.name === expressInstance &&
          curr.parent.type === 'MemberExpression' &&
          curr.parent.property.name === 'use'
        ) {
          //pinpoint the array of args passed to this method invocation
          const callExpPath = curr.findParent((curr) =>
            curr.isCallExpression()
          );
          const arguments = callExpPath.node.arguments;

          //check for links to router files imported above
          if (
            arguments.length > 1 &&
            Object.hasOwn(importLabels, arguments[1].name)
          ) {
            // linksToRouter[importLabels[arguments[1].name]] = arguments[0].value;
            linksToRouter[arguments[0].value] = importLabels[arguments[1].name];
            //    '/auth': '/Users/cush572/Codesmith/TEST/ReacType/server/routers/auth.ts',
            //   '/user-styles': '/Users/cush572/Codesmith/TEST/ReacType/server/routers/stylesRouter.ts'
          }
        }

        //TODO: refactor below and turn into helper function since this is similar to the condition inside traverseRouterFile function 

        //check for server endpoints that bypass router files and link directly to middleware functions in controller files. Populate allServerRoutesLeadingToController obj accordingly.
        if (
          curr.isIdentifier() &&
          curr.node.name === expressInstance &&
          curr.parent.type === 'MemberExpression' &&
          CRUDMETHODS.includes(curr.parent.property.name)
        ) {
          const method = curr.parent.property.name;
          const callExpPath = curr.findParent((curr) =>
            curr.isCallExpression()
          );
          const arguments = callExpPath.node.arguments;
          const endpoint = arguments[0].value;
          arguments.slice(1, -1).forEach((arg) => {
            if (!arg.object) return;
            if (Object.hasOwn(importLabels, arg.object.name)) {
              //check if import label exists (we found import label arg.object.name inside the imports at top of page)
              const middlewareMethod = {
                path: importLabels[arg.object.name],
                middlewareName: arg.property.name,
              }; //     { path: ${absoluteFilePathOfController}, middlewareName: ${nameOfMiddleware}}
              if (allServerRoutesLeadingToController[filePath]) {
                if (allServerRoutesLeadingToController[filePath][endpoint]) {
                  if (
                    allServerRoutesLeadingToController[filePath][endpoint][
                      method
                    ]
                  ) {
                    allServerRoutesLeadingToController[filePath][endpoint][
                      method
                    ].push(middlewareMethod);
                  } else {
                    allServerRoutesLeadingToController[filePath][endpoint][
                      method
                    ] = [middlewareMethod];
                  }
                } else {
                  allServerRoutesLeadingToController[filePath][endpoint] = {
                    [method]: [middlewareMethod],
                  };
                }
              } else {
                // console.log('doesn’t exist');
                allServerRoutesLeadingToController[filePath] = {
                  [endpoint]: { [method]: [middlewareMethod] },
                };
              }
            }
          });
        }
      },
    });
    console.log(
      linksToRouter,
      'linksToRouter',
      allServerRoutesLeadingToController,
      'allServerRoutesLeadingToController'
    );
  };

  const allRouterRoutesLeadingToController = {}; //all routes in router that lead to controller


  //function for traversing router files, checking for links controller files and populating these links in the above object
  const traverseRouterFile = (ast, filePath, expressLabel, routerInstance) => {
    //
    let importLabels = {};
    traverse(ast, {
      enter(curr) {
        //GET LOCALLY IMPORTED FILE LABEL:
        if (
          curr.isStringLiteral() &&
          curr.node.value.includes('./') &&
          curr.parent.type === 'ImportDeclaration'
        ) {
          //IRENE: provides access to all the imports at the top of the file
          importLabels = addES6Import(curr, filePath, importLabels);
        }


        if (
          curr.isStringLiteral() &&
          curr.node.value.includes('./') &&
          curr.parent.type === 'CallExpression'
        ) {
          if (curr.parent.callee.name === 'require')
            importLabels = addES5Import(curr, filePath, importLabels);
        }

        //FIND INSTANCE OF ROUTER AND FILTERING FOR THE CRUD METHODS WITHIN IT
        //TODO: refactor to helper function (same as function from above)
        if (
          curr.isIdentifier() &&
          curr.node.name === routerInstance &&
          curr.parent.type === 'MemberExpression' &&
          CRUDMETHODS.includes(curr.parent.property.name)
        ) {
          //IRENE: finding instance of router
          const method = curr.parent.property.name; //IRENE: trying to understand what specific method is being invoked here
          const callExpPath = curr.findParent((curr) =>
            curr.isCallExpression()
          ); //IRENE:
          const arguments = callExpPath.node.arguments; //IRENE: trying to find the arguments of router.METHOD()
          const endpoint = arguments[0].value; //IRENE: we know first arg will always be the endpoint
          arguments.slice(1, -1).forEach((arg) => {
            if (!arg.object) return;
            //IRENE: we know last arg will be the middleware that handles sending the response back to client. we now need to just look at the arguments between the first and last so we can identify the controller/middleware
            if (Object.hasOwn(importLabels, arg.object.name)) {
              //IRENE: check if name of the argument in the argument object matches the label in importLabels object
              const middlewareMethod = {
                path: importLabels[arg.object.name],
                middlewareName: arg.property.name,
              }; //   {path: ${absoluteFilePathOfController}, middlewareName: ${nameOfMiddleware}}
              //{{path: ${absoluteFilePathOfController}, middlewareName: ${nameOfMiddleware}}}
              if (allRouterRoutesLeadingToController[filePath]) {
                if (allRouterRoutesLeadingToController[filePath][endpoint]) {
                  if (
                    allRouterRoutesLeadingToController[filePath][endpoint][
                      method
                    ]
                  ) {
                    allRouterRoutesLeadingToController[filePath][endpoint][
                      method
                    ].push(middlewareMethod);
                  } else {
                    allRouterRoutesLeadingToController[filePath][endpoint][
                      method
                    ] = [middlewareMethod];
                  }
                } else {
                  allRouterRoutesLeadingToController[filePath][endpoint] = {
                    [method]: [middlewareMethod],
                  };
                }
              } else {
                console.log('doesn’t exist');
                allRouterRoutesLeadingToController[filePath] = {
                  [endpoint]: { [method]: [middlewareMethod] },
                };
              }
              //TEMPLATE: allRouterRoutesLeadingToController = {
              //   [filePath]: {
              //     [endpoint]: {
              //       [GET]: [middlewareMethod],
              //       [POST]: [middlewareMEthod]
              //     }
              //   }
              // }

              //EXAMPLE END RESULT: allRouterRoutesLeadingToController{
              //   '/Users/cush572/Codesmith/Week4/unit-10-databases/server/routes/api.js': {
              //     '/': { get: Array },
              //     '/species': { get: Array },
              //     '/homeworld': { get: Array },
              //     '/film': { get: Array },
              //     '/character': { post: Array, delete: Array }
              //   }
              // }
            }
          });
        }
      },
    });
    console.log('allRouterRoutes....', allRouterRoutesLeadingToController, 'importLabelsssszzz', importLabels);
  };


  controllerSchemas = {};

  //function to traverse controller files, identifying middleware methods and their corresponding interactions with database schemas, and populating this information in the above controllerSchemas object
  const traverseControllerFile = (ast, filePath, label, instance) => {
    const imports = {};
    const schemaInteractions = {};
    let currentControllerMethod;
    let expressionStatementPossible = false;
    let variableStatementPossible = false;

    console.log('CONTROLLER FILE PATH', filePath);
    traverse(ast, {
      enter(curr) {

        //account for cases where controller methods are explicitly defined within a controller object
        if (
          variableStatementPossible &&
          currentControllerMethod &&
          curr.parent.type === 'ObjectExpression'
        ) {
          const callExpPath = curr.findParent(curr => curr.isCallExpression())
          if (callExpPath) {
            if (callExpPath.node.callee) {

              if (callExpPath.node.callee.object) {
                if (Object.keys(imports).includes(callExpPath.node.callee.object.name)) return;
              } else if (callExpPath.node.callee.name) {
                if (callExpPath.node.callee.name === "next") return;
              }
            }
          }
          currentControllerMethod = '';
        }

        //if back in the global context of the file (un-nested), and the previous branch was determined to be a controller method, and DB schema interactions were found in this method, populate the controllerSchemas object with relevant info (found in schemaInteractions object)
        if (curr.parent.type === 'Program') {
          console.log('schemaInt', schemaInteractions)
          if (currentControllerMethod && Object.keys(schemaInteractions).length)
            controllerSchemas[filePath] = schemaInteractions;
          console.log('controllerSchemas', controllerSchemas)
          currentControllerMethod = '';
          if (curr.node.type === 'ExpressionStatement')
            expressionStatementPossible = true;
          if (curr.node.type === 'VariableDeclaration')
            variableStatementPossible = true;
        }

        //check for files imported locally using ES6 syntax
        if (
          curr.isStringLiteral() &&
          curr.node.value.includes('./') &&
          curr.parent.type === 'ImportDeclaration'
        ) {
          const importDecPath = curr.findParent((curr) =>
            curr.isImportDeclaration()
          );
          const importLabels = importDecPath.node.specifiers.map(
            (obj) => obj.local.name
          );
          const currDirectory = path.dirname(filePath);
          const afp = path.resolve(currDirectory, curr.node.value);
          const afpArray = allFiles.filter((file) => file.includes(afp));
          if (afpArray.length)
            importLabels.forEach((label) => (imports[label] = afpArray[0]));
        }

        //check for files imported locally using ES5 syntax
        if (
          curr.isStringLiteral() &&
          curr.node.value.includes('./') &&
          curr.parent.type === 'CallExpression'
        ) {
          if (curr.parent.callee.name === 'require') {
            let importLabel = findVariableName(curr);
            const currDirectory = path.dirname(filePath);
            const afp = path.resolve(currDirectory, curr.node.value);

            const afpArray = allFiles.filter((file) => file.includes(afp));
            if (typeof importLabel === 'string') importLabel = [importLabel];
            if (afpArray.length)
              importLabel.forEach((label) => (imports[label] = afpArray[0]));
          }
          console.log('imports', imports)
        }

        //filtering for IDENTIFIER:
        //that has a parent that is an OBJECT PROPERTY, where the object property has a child VALUE that is of type FUNCTIONEXPRESSION or ARROWFUNCTIONEXPRESSION
        if (
          (expressionStatementPossible || variableStatementPossible) &&
          !currentControllerMethod &&
          curr.isIdentifier() &&
          curr.parent.type === 'ObjectProperty' &&
          curr.parent.value.type === 'ArrowFunctionExpression'
        ) {
          currentControllerMethod = curr.node.name;
        }

        //OR:
        //that has a parent that is a MEMBEREXPRESSION, a grandparent that is an ASSIGNMENTEXPRESSION, and an uncle RIGHT property that is an ARROWFUNCTIONEXPRESSION with a params child of length 3;
        if (
          variableStatementPossible &&
          !currentControllerMethod &&
          curr.isIdentifier() &&
          curr.parent.property &&
          curr.parent.type === 'MemberExpression' &&
          curr.parentPath.parent.type === 'AssignmentExpression' &&
          curr.parentPath.parent.right
        ) {
          if (curr.parent.property.name === curr.node.name)
            currentControllerMethod = curr.node.name;
          console.log('currentControllerMethod', currentControllerMethod)
        }

        if (
          currentControllerMethod &&
          curr.isIdentifier() &&
          Object.hasOwn(imports, curr.node.name) &&
          curr.parent.type === 'MemberExpression' &&
          curr.parent.property
        ) {
          console.log('currentControllerMethod2', currentControllerMethod)
          schemaInteractions[currentControllerMethod]
            ? schemaInteractions[currentControllerMethod].push(curr.node.name)
            : (schemaInteractions[currentControllerMethod] = [curr.node.name]);
        }
      },
    });
    console.log('schemaInteractions', schemaInteractions, 'imports', imports);
  };

  const schemas = {};
  const schemaKey = {};

  //function for traversing mongoose model files and populating the above schemaKey object with each schema name and its associated schema structure
  const traverseMongooseFile = (
    ast,
    filePath,
    mongooseLabel,
    schemaInstance
  ) => {
    traverse(ast, {
      enter(curr) {
        //check for new schema instances
        if (
          curr.isIdentifier() &&
          curr.node.name === schemaInstance &&
          curr.parent.type === 'NewExpression'
        ) {
          const propsArray = curr.parent.arguments[0].properties;
          const schemaName = findVariableName(curr);
          
          //helper func used to create a clone of the schema as found in the file
          const populateSchema = (propsArray) => {
            const output = {};
            if (propsArray) {
              propsArray.forEach((prop) => {
                const key = prop.key.name;
                prop.value.type === 'Identifier'
                  ? (output[key] = prop.value.name)
                  : prop.value.type === 'StringLiteral' ||
                    prop.value.type === 'BooleanLiteral'
                  ? (output[key] = prop.value.value)
                  : prop.value.type === 'ObjectExpression'
                  ? (output[key] = populateSchema(prop.value.properties))
                  : prop.value.type === 'ArrayExpression'
                  ? (output[key] = prop.value.elements.map((obj) =>
                      populateSchema(obj.properties)
                    ))
                  : (output[key] = 'UNKOWN VALUE');
              });
            }
            return output;
          };

          //set the schema variable name to the schema
          schemas[schemaName] = populateSchema(propsArray);
          console.log('schemas', schemas);
        }

        //populate schemaKey object with the label each schema is being exported as set to the schema itself
        if (
          curr.isIdentifier() &&
          curr.node.name === mongooseLabel &&
          curr.parent.type === 'MemberExpression' &&
          curr.parent.property.name === 'model'
        ) {
          const callExpPath = curr.findParent((curr) =>
            curr.isCallExpression()
          );
          let schemaExport;
          if (Object.hasOwn(schemas, callExpPath.node.arguments[1].name)) {
            console.log(callExpPath.node.arguments[1].name, 'zzzzz')
            const schemaExport = findVariableName(curr) || callExpPath.node.arguments[0].value[0].toUpperCase() + callExpPath.node.arguments[0].value.slice(1);
            schemaKey[schemaExport] =
              schemas[callExpPath.node.arguments[1].name];
          }
        }
      },
    });
    console.log(schemaKey, 'schemaKey');
    return;
  };

  const allFiles = res.locals.allFiles;

  //iterate through array of files, convert each to AST, and invoke function to traverse the AST
  allFiles.forEach((filePath) => {
    const ast = parseFile(filePath);
    // console.log('ast');
    traverseServerAST(ast, filePath);
  });

  console.log('here');
  const output = {};

  //populate the above output object with endpoints distributed from the root server file to router files, and their associated methods, schema labels, and schemas
  Object.keys(linksToRouter).forEach((route) => {
    // console.log('linksToRouter', linksToRouter, 'aRRLTC', allRouterRoutesLeadingToController)
    if (
      Object.hasOwn(allRouterRoutesLeadingToController, linksToRouter[route])
    ) {
      Object.keys(
        allRouterRoutesLeadingToController[linksToRouter[route]]
      ).forEach((key) => {
        // console.log('route', route, 'key', key)
        Object.keys(
          allRouterRoutesLeadingToController[linksToRouter[route]][key]
        ).forEach((method) => {
          // console.log('method', method, route, key)
          allRouterRoutesLeadingToController[linksToRouter[route]][key][
            method
          ].forEach((controllerMethod) => {
            // console.log('controllerMethod', controllerMethod, route, key, 'controllerSchemas', controllerSchemas)
            if (Object.hasOwn(controllerSchemas, controllerMethod.path)) {
              if (
                Object.hasOwn(
                  controllerSchemas[controllerMethod.path],
                  controllerMethod.middlewareName
                )
              ) {
                controllerSchemas[controllerMethod.path][
                  controllerMethod.middlewareName
                ].forEach((schema) => {
                  if (schemaKey[schema]) {
                    if (output[route + key]) {
                      if (
                        output[route + key][method] &&
                        !output[route + key][method][schema]
                      ) {
                        output[route + key][method][schema] = schemaKey[schema];
                      } else if (!output[route + key][method]) {
                        output[route + key][method] = {
                          [schema]: schemaKey[schema],
                        };
                      }
                    } else {
                      output[route + key] = {
                        [method]: { [schema]: schemaKey[schema] },
                      };
                    }
                  }
                });
              }
            }
          });
        });
      });
    }
  });

  // { '/api/': {
  //     'GET': { 'Person': { 'name': 'String' } },
  //     'POST': { 'Species': { 'type': 'String' } }
  //   },
  //   { '/api/homeworld': {
  //       'GET': { 'Person': 'String' } }
  //   }
  // }

  //populate the output object with endpoints distributed from the root server file directly to controller files, and their associated methods, schema labels, and schemas
  Object.keys(allServerRoutesLeadingToController).forEach((file) => {
    Object.keys(allServerRoutesLeadingToController[file]).forEach((route) => {
      Object.keys(allServerRoutesLeadingToController[file][route]).forEach(
        (method) => {
          allServerRoutesLeadingToController[file][route][method].forEach(
            (middlewareMethod) => {
              if (Object.hasOwn(controllerSchemas, middlewareMethod.path)) {
                if (
                  Object.hasOwn(
                    controllerSchemas[middlewareMethod.path],
                    middlewareMethod.middlewareName
                  )
                ) {
                  controllerSchemas[middlewareMethod.path][
                    middlewareMethod.middlewareName
                  ].forEach((schema) => {
                    if (schemaKey[schema]) {
                      console.log(
                        'here!!!!11',
                        schemaKey[schema],
                        schema,
                        route
                      );
                      if (output[route]) {
                        if (
                          output[route][method] &&
                          !output[route][method][schema]
                        ) {
                          output[route][method][schema] = schemaKey[schema];
                        } else if (!output[route][method]) {
                          output[route][method] = {
                            [schema]: schemaKey[schema],
                          };
                        }
                      } else
                        output[route] = {
                          [method]: { [schema]: schemaKey[schema] },
                        };
                    }
                  });
                }
              }
            }
          );
        }
      );
    });
  });

  console.log('plz work...', output);
  res.locals.serverRoutes = output;

  return next();
};

module.exports = serverASTController;
