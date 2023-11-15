const fs = require('fs');
const path2 = require('path');
const parser = require('@babel/parser');
// const { isIdentifier, isStringLiteral } = require('typescript');
const traverse = require('@babel/traverse').default;

//readFileSync method of the fs module is used to grab all the code from 'filePath',
//then the parse method in babel parser is used to create and return an AST version of
//this file.
const parseFile = (filePath) => {
  const fileCode = fs.readFileSync(filePath, 'utf-8');
  return parser.parse(fileCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
}


export const parseAllComponents = (event, args, res) => {
  let components = {};

  const templateLiteralRouteParser = (node) => {
    let quasis = node.quasis;
    let fullRoute = ``;
    for (let i = 0; i<quasis.length; i++) {
      fullRoute += quasis[i].value.raw;
      if (i < quasis.length-1) fullRoute += '${' + node.expressions[i].name + '}';
    }
    return fullRoute;
  }

  //
  const traverseAST = (ast, filePath) => {
    //variables that will persist as we traverse from node to node
    const potentialChildren = [];
    let children = {};
    let current = '';
    let isComponent = false;
    let mightBeComponent = false;
    let hardNO = false;

    let fetchPrimed = false;
    let ajaxRequests = [];
    let xmlHttpReq;

    let axiosLabel;

    let nextJSLinkImported = false;
    
    //babel traverse is used to traverse the passed in ast
    traverse(ast, {

      //for each node (i.e. 'path') in the 'ast', the 'enter' method will be invoked
      enter(path) {

        //check if we are in the global scope within the file (i.e. not nested). if so, we
        //should check if the previously traversed code block was a component
        if (path.parent.type === "Program") {
          //if the prev code block was a component, add the information from this component to the 'components' object
          if (current !== '' && isComponent && !hardNO) {
            components[filePath] = { data: { label: current }, children: {...children}, ajaxRequests, id: filePath };
          }
          potentialChildren.push(current);

          //reset component information whenever global space is re-entered
          children = {};
          current = '';
          isComponent = false;
          ajaxRequests = [];
          hardNO = false;

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

          //prime axios handler if axios is imported
          if (relativePath === "axios") axiosLabel = path.node.name;
        }

        //if we find a 'callee' with the name 'fetch', we know a fetch is being invoked, so we reassign 'fetchPrimed' to true, which will trigger the program to look for the route (...in the condition directly below this)
        if (path.isCallExpression()) {
          const callee = path.node.callee;
          if (callee.type === "Identifier" && callee.name === "fetch") fetchPrimed = true;
        }

        //the first either TemplateLiteral or StringLiteral node after fetch should be the route string
        if (fetchPrimed && (path.node.type === "TemplateLiteral" || path.node.type === "StringLiteral")) {
          let route = '';
          let fullRoute = ``;
          let method = 'GET';

          //a TemplateLiteral node will have 2 properties: expressions, which store variables, and quasis, which store normal chars in the string. Order of data will always altername between quasi and expressions, and length of quasis will always be length of expressions + 1. This logic can be used to reconstruct this literal string.
          if (path.node.type === "TemplateLiteral") {
            route = path.node.quasis[0].value.raw;
            fullRoute = templateLiteralRouteParser(path.node);
          } else if (path.node.type === "StringLiteral") fullRoute = route = path.node.value;

          //arguments prop is sibling of the above literal prop in the AST
          const argArrr = path.parentPath.node.arguments;
          let objExpIdx = -1;

          //ObjectExpression node will exist in arguments array if fetch contains body as 2nd arg. if none is found, fetch method must be GET
          if (argArrr) {
            argArrr.forEach((sibling, i) => sibling.type === "ObjectExpression" ? objExpIdx = i : null);

            if (objExpIdx > -1) {
              const objProps = argArrr[objExpIdx].properties;
              objProps.forEach(prop => {
                if (prop.key.name === 'method') method = prop.value.value;
              })
            }
          }

          //push route and method data into ajaxRequests array, which will be added to component object
          ajaxRequests.push({ route, fullRoute, method });
          fetchPrimed = false;
          // console.log('this is a route?', ajaxRequests)
        }

        //XMLHttpRequest handlers
        if (path.isIdentifier() && path.node.name === "XMLHttpRequest" && path.parent.type === "NewExpression") {
            const declarationPath = path.findParent((path) => path.isVariableDeclarator());
            if (declarationPath) xmlHttpReq = declarationPath.node.id.name;
            // console.log('xmlhttprequest')
        }

        if (path.isIdentifier() && path.node.name === xmlHttpReq && path.parent.property.name === "open") {
          const callExpressionPath = path.findParent((path) => path.isCallExpression());
          if (callExpressionPath) {
            const argsArrr = callExpressionPath.node.arguments;
            const method = argsArrr[0].value;
            const route = argsArrr[1].value;
            ajaxRequests.push({ route, fullRoute: route, method });
          }
        }

        // axios handler
        if (axiosLabel && path.isIdentifier() && path.node.name === axiosLabel && path.findParent((path) => path.isCallExpression())) {
          let route;
          let method;
          let fullRoute;
          const callExpressionPath = path.findParent((path) => path.isCallExpression());
          if (!callExpressionPath.arguments) return
          if (path.parent.type === "MemberExpression") {
            method = path.parent.property.name.toUpperCase();
            const callExpArgsArr = callExpressionPath.node.arguments[0];
            if (!callExpArgsArr) console.log('FILEPATH:', filePath, 'CEP', callExpressionPath)
            if (callExpArgsArr.type === "StringLiteral") {  
              route = fullRoute = callExpArgsArr.value;
            } else if (callExpArgsArr.type === "TemplateLiteral") {
              route = callExpArgsArr.quasis[0].value.raw;
              fullRoute = templateLiteralRouteParser(callExpArgsArr);
            } else if (callExpArgsArr.type === "MemberExpression") {
              route = fullroute = `${callExpArgsArr.object.name}.${callExpArgsArr.property.name}`;
            }
          } else if (path.parent.arguments[0].properties) {
            path.parent.arguments[0].properties.forEach(prop => {
              if (prop.key.name === "method") method = prop.value.value.toUpperCase();
              if (prop.key.name === "url") {
                if (prop.value.type === "TemplateLiteral") {
                  route = prop.value.quasis[0].value.raw;
                  fullRoute = templateLiteralRouteParser(prop.value);
                } else route = fullRoute = prop.value.value;
              }
            })
          }
          ajaxRequests.push({ route, fullRoute, method });
        }



        //this is an attempt to filter out false positives from test files
        if (path.isIdentifier() && (path.node.name === "describe" || path.node.name === "xdescribe" || path.node.name === "test" || path.node.name === "xtest") && path.parent.type === "CallExpression" && path.parentPath.parent.type === "ExpressionStatement") hardNO = true;

        //same as below
        if (path.isIdentifier() && (path.parent.type === "JSXExpressionContainer" || path.parentPath.parent.type === "JSXExpressionContainer") && Object.keys(potentialChildren).includes(path.node.name)) {
          isComponent === true;
          const newChildPath = potentialChildren[path.node.name];

          if (newChildPath) children[newChildPath] = null;
        }

        //if the current node has a pattern that is consistently true for child JSX components, and it was deemed to be a potential child via navigating the import statements above, then we can add its file path to the children array for the current component
        if (path.isJSXIdentifier()) {
          isComponent = true;
          if (path.parentPath.parent.type === "JSXElement" && Object.keys(potentialChildren).includes(path.node.name)) {
            const newChildPath = potentialChildren[path.node.name];

            if (newChildPath) children[newChildPath] = null;
          }
        }

        //preliminary logic for handling next.JS
        if (path.isStringLiteral() && path.node.value === "next/link" && path.parent.type === "ImportDeclaration") {
          const specifiers = path.parent.specifiers;
          specifiers.forEach(obj => {
            if (obj.local.name === "Link") nextJSLinkImported = true;
          })
        }

        if (nextJSLinkImported && path.isJSXIdentifier() && path.node.name === "Link" && path.parent.type === "JSXOpeningElement") {
          const attributes = path.parent.attributes;
          attributes.forEach(obj => {
            let route;
            if (obj.name.name === "href") {
              let route = obj.value.type === "StringLiteral" ? obj.value.value : null;
              let expression = route ? null : obj.value.expression;
              if (!route) {
                if (expression.type === "StringLiteral") {
                  route = expression.value;
                } else if (expression.type === "TemplateLiteral") {
                  route = expression.quasis[0].value.raw;
                }
              }
              const currDirectory = path2.dirname(filePath);
              const childFilePath = path2.resolve(currDirectory, route)
              const afp = allFiles.filter(file => file.includes(childFilePath))[0];
              children[afp] = null;
            }
          })

          //TODO: if we find a Link tag, store this link tag and the filePath it is located in inside of a "links" object. After traversing all files, identify the component for which the link component is a child. add the route as a child of that component.(?)
          
        }


      }
    })

    //if the component is exported in this way: "export const ComponentName = () => {...}", it might be the case that there is no code after the component code block, in which case we should check if the previous code block was a component 1 last time.
    if (current !== '' && isComponent && !hardNO) components[filePath] = { data: {label: current}, children: {...children}, ajaxRequests, id: filePath };
  }


  const allFiles = res.locals.allFiles.filter((file) => !file.includes('/__tests__/') && file.split('.').length == 2);
  // console.log('allFiles:', allFiles);

  //iterate through array of files, convert the code in each file to an AST, and invoke 'traverseAST' to traverse the AST
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
    const arrayOfChildFilePaths = Object.keys(component.children);

    component.children = arrayOfChildFilePaths;
  })

  // console.log('components', components)
  res.locals.components = components


}

//used to grab code from the file associated with a component, to be displayed in details section on front end
export const getCode = async (event, args, res) => {
  try {
    const { id } = args;
    const decodedId = decodeURIComponent(id);

    const fileCode = fs.readFileSync(decodedId, 'utf-8');

    res.locals.componentCode = fileCode;
  } catch(err) {
    console.error(err);
    throw new Error('Error in componentController.getCode')
  }
}