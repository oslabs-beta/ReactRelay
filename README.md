# irene-test

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```



### Documentation


### Description
ReactRelay is a codebase visualization tool for React-based Javascript projects that allows users to visualize the frontend of a project as a tree of linked nodes (components), and see the AJAX requests associated with each component, as well as their corresponding database schemas. A search feature is available to rapidly identify specific components within a large codebase, and a code-preview tab exists for each component that shows the components code, formatted exactly as it is in the file. 


### CONTROLLER FILES

### fsController 
Uses the fs module to analyze a directory and extract the absolute file paths of all the files in that directory, organized in the **allFiles** array in the res.locals object.


### componentController
The ***parseFile*** method in ***componentController*** serves to analyze the frontend structure and synthesize an object containing information about all the components. A ***components*** object is sent to the frontend, and it is structured as follows:

  ***components***
    ```
      {
        ***absolute file path***: {
          data: { label: ***component name*** },
          children: [
            ***absolute file path of a child component***,
            ***absolute file path of another child component***,
          ],
          ajaxRequests: [
            {
              route: ***name of endpoint not including variables***,
              fullRoute: ***name of endpoint including variables***,
              method: ***method type*** (GET, POST, etc)
            },
            { ***potentially another ajax request object*** }
          ],
          id: ***absolute file path***
        },
        ***another AFP***: { ***another component object*** }
      }
    ```


The ***getCode*** method in ***componentController*** takes in the absolute file path of a component as a query parameter, and uses the fs module to extract the code from this file and save it to res.locals.componentCode, to be sent back to the frontend.




### serverASTController
The ***parseAll*** method in ***serverASTController*** servers to analyze the server files associated with AJAX requests from the frontend. An array of server-side file paths, ***allFiles***, is iterated through, and the code from each file is converted to an abstract syntax tree using babel parser, then traversed using babel traverse.

The ***traverseServerAST*** function first organizes the file by file type (mongoose model files, controller files, router files, and root server file). Once a file's type has been determined, it is passed in to another function that is specific for that file type:

***traverseServerFile*** analyzes the root server file for incoming endpoints, and organizes the resulting information into 2 objects:
  ***linksToRouter***
    ```
      {
        ***endpoint fragment***: ***AFP of corresponding router file***,
        ***another endpoint frag***: ***another router file AFP***
      }
    ```

  ***allServerRoutesLeadingToController***
    ```
      {
        ***absolute file path of root***: {
          ***endpoint***: {
            ***method name***: [
              {
                path: ***AFP of file containing middleware method***,
                middlewareName: ***name of middleware method***
              },
              {
                ***potentially another middleware object***
              },
            ],
            ***another method name***: [
              ***another array of middleware objects***
            ],
          },
          ***another endpoint***: {
            ***another endpoint object*** 
          },
        },
      }
    ```

***traverseRouterFile*** analyzes router files for ajax method invocations on an express instance, and packages the corresponding route, as well as its associated chain of middleware functions, into an object called:

  ***allRouterRoutesLeadingToController***
    ```
      {
        ***absolute file path of router***: {
          ***endpoint fragment***: {
            ***method name***: [
              {
                path: ***AFP of file containing middleware method***,
                middlewareName: ***name of middleware method***,
              },
              { ***another middleware object*** }
            ],
            ***another method name***: [ 
              ***another array of middleware objects***
            ]
          },
          ***another endpoint fragment***: {
            ***another endpoint object***
          },
        }
      }
    ```


***traverseControllerFile*** analyzes controller files for middleware methods, and their corresponding interactions with database schemas, populating this information into the ***controllerSchemas*** object:

  ***controllerSchemas***
    ```
      {
        ***absolute file path of current file***:
          ***middleware method name***: [
            ***schema name***,
            ***another schema name***,
          ],
          ***another middleware method name***: [
            ***another array of associated schema names***
          ]
      }
    ```

***traverseMongooseFile*** analyzes mongoose model files for new Schema instances and their corresponding labels, then uses these labels to determine the names they are exported as, and creates the ***schemaKey*** object from this information:
  ***schemaKey***
    ```
      {
        ***exported schema name***: {
          ***schema object***
        },
        ***another exported schema name***: { ***another schema object*** }
      }
    ```

After traversing all files and populating the above referenced objects, the ***allServerRoutesLeadingToController*** and ***allRouterRoutesLeadingToController*** objects are traversed independently to populate the same ***output*** object that is formatted as follows:

  ***output***
    ```
      {
        ***complete endpoint***: {
          ***CRUD method name***: {
            ***schema name***: { ***schema object*** },
            ***another schema name***: { ***another schema object*** }
          },
          ***another CRUD method name***: { **another object of schemas** }
        },
        ***another complete endpoint***: { ***another object of all method calls to this endpoint*** }
      }
    ```

    
--------------------------------------------------------------------------


### FRONTEND COMPONENT FILES


### ProjectPathModal.tsx


### Tree.tsx
***reactflow*** is used to generate and render a tree of 'nodes' connected to each other by 'edges'. ***dagre***, a library for organizing graphs, is used to automatically position the nodes and edges so they are appropriately spaced. 

The ***reactFlowComponents*** object is imported from the Redux Store, and, through a series of steps, is used to: 1. create the appropriate number of nodes for each component, and 2. create an edge for each parent-child relationship that connects each parent component node to a unique child component node.

***onNodeClick*** functionality is implemented to set a node to have an active state on-click. (see ***custom-nodes***), and to update the highlighted edges to be the lines surrounding the newly active node.

**ReactFlow** COMPONENT PROPS
  **minZoom** is used to increase zoom-out range.
  **onClick** is used to minimize the details panel when the background is clicked.


### custom-nodes
Node position is handled by **dagre**. Node color is conditional: 
  -red if the current search value is included in the component name, -yellow if the component is the currently active component, 
  -blue if the component contains AJAX request(s) (**custom-node.tsx**), and -white if the component doesn't contain any AJAX request(s) (**custom-node2.tsx**).


### Header.tsx
Child of ***App.tsx***. Displays header of application. **showSearch** variable is set to the current value in the search input field, and is updated and dispatched the redux store on-change. This variable is used by ***custom-nodes***, which will turn red if their name includes current search value.

Folder button on the far-right side of the header opens the ***ProjectPathModal.tsx*** component.

### ProjectPathModal.tsx
Child of ***App.tsx***. Conditionally displayed on-button-click (see ***Header.tsx*** above). 

**openFileExplorer** function is invoked on click of one of two "CHOOSE PATH" buttons. One for the source code folder and one for the server folder. The user is prompted to select a local folder on-click. The "Continue" button results in the **onContinue** function being invoked, which closes the pop-up modal, and invokes **postPath** for each selected folder. For each invocation, a POST request is made, passing in the selected absolute folder path. The object returned as a response from the server is used to populate either the **components** object or the **server** object in the redux store, depending on which button was used to select the folder. This triggers the **reactFlowComponents** object in ***Tree.tsx*** to be populated, which triggers a useEffect hook that has this object in its dependency array to be invoked, triggering the population of **nodes** and **edges**, via this object, which should result in the rendering of the the component tree.


### Details.tsx
On node-click, the height of the details container is conditional based on the viewport height. Clicking the background of the tree container will minimize the details container. It can also be adjusted manually via click-and-drag.

The **useNavigate** hook from ***react-router-dom*** API is used to conditionally render either the routes and corresponding schemas of the active component, or the formatted code from the file that the active component is in. The displayed schemas default to those corresponding to the top-most route, and the schemas for each route will be shown when that route is clicked (see ***MethodButton.tsx***).


### MethodButtonContainer.tsx
Child of ***Details.tsx***. Extracts all AJAX requests in the active component via the **nodeInfo** object, and returns a ***MethodButton*** component instance for each request. When a new component is clicked, the active route defaults to the top-most route, as mentioned in the Details.tsx section. 

### MethodButton.tsx
On-click, the **activeRoute** object is set to the AJAX-request-info that the clicked button represents. 

### ModelPreview.tsx
Child of ***Details.tsx***. Sets the list of schemas on the right side of the component details container based on the **activeRoute** (imported via the useSelector hook). 

### ComponentCode.tsx
Child of ***Details.tsx***. Displays the code of the file in which the active component is contained. ***activeComponentCode*** is imported from the redux store via the useSelector hook. This code is fetched in ***Tree.tsx*** **onNodeClick**.

















