# ReactRelay

[ReactRelay](https://reactrelay.com) codebase visualization tool with React using Redux for state-management, TypeScript, built on top of [Electron-Vite](https://electron-vite.org/), with data visualization being built off of [React Flow](https://reactflow.dev/) and using [Tailwind](https://tailwindcss.com/) for our styling. This app was designed to create a representation of a project folder's component and file connections, giving a code-preview of individual components, highlighting components wich contain AJAX calls, and any accompanying database schemas. Users are also able to quickly find specific components inside of their project. The application is designed to be used as a tool for developers to visualize the structure of their projects and to help them understand the flow of data through their applications, navigate to specific components, and improve the onboarding experience for both senior and junior devs being introduced to a project.

ReactRelay is a codebase visualization tool for React-based Javascript projects that allows users to visualize the frontend of a project as a tree of linked nodes (components), and see the AJAX requests associated with each component, as well as their corresponding database schemas. A search feature is available to rapidly identify specific components within a large codebase, and a code-preview tab exists for each component that shows the component's code, formatted exactly as it is in the file.



## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Install

```bash
$ npm install
```
# Project Setup


## Development

For development with hot reloading, run `npm run dev` in the root directory. This will start the electron-vite server and the electron app. The electron app will automatically reload when changes are made. 

## Production

In order to create a package for your current operating system, run "npm run package" in the root directory. This will create a distributable for the current operating system.
For production, run `npm run build` in the root directory. This will build the vite server and the electron app. The electron app will then be located in the dist folder. To run the the production build, type `npm start` in the root directory. This will start the electron app from your built project.

## Usage

### Selecting Your Project
![Project Selection](https://github.com/oslabs-beta/ReactRelay/assets/103789011/7e429c46-c6b7-4419-b74c-f6bf71375323)

When opening the application, you will start by opening the file-explorer folder in the top-right corner. You will be shown an option to select two fileds; the component directory an the server directory. Clicking on the button for selecting components will open a file explorer. From there you can select either the src folder of your react project or you can select the components folder, depending on how you've structured your project. With the second button, you will open a file explorer where you can select your project's server folder. Depending on how your project is structured you can either select **only** your **src** folder and pressing continue or to select both your server and your components folder. When you continue, you will be presented with a hierarchical component tree of your project.

### Navigating the Tree

From here, you will see the components of your project laid out with animated lines connecting parent and children components to one another. Components which contain AJAX requests are shown in dark blue whereas other components will be shown in white. By clicking on one of these components, the lines connecting your selected components will be shwon in red and they will allow you to more easily see the immediate relationships of the component you've chosen. From there, you will see a tab appear on the bottom which shows the AJAX routes of the component, if present, as well as a preview for the database schema it's connected, if present. Clicking on the yellow button labelled "code" in the tab will show you a code preview of the component you have selected. 
![Tree Navigation](https://github.com/oslabs-beta/ReactRelay/assets/103789011/fe231a5d-8e2a-4d5e-9f75-9ab625146089)

### Other Controls

Now that you know how to navigate the tree, there are some other components which will help you to explore the tree. The controls in the top right allow you to zoom in and out of the tree, to lock the components so you can no longer move them to avoid changing their layout by accident, as well as a button which centers your viewport on your code. In the bottom-right corner there is a minimap which shows a layout of your tree which you are able to click on to jump to a section of your tree and the ability zoom in on with the mouse wheel to control your window's zoom level while your cursor is over the minimap. In the top-left corner of your window are two  buttons which control the layout of tree, whether it is organized vertically or horizontally. In the top right, there is a magnifying glass which, when clicked, shows an input field which allows you to type in the name of a component you're looking for, which will be highlighted in red, allowing you to more quickly locate it inside of the tree.
![Layout and Search](https://github.com/oslabs-beta/ReactRelay/assets/103789011/c2447079-169f-4afe-9dd8-cfd5c39f8723)
![Minimap and Controls)](https://github.com/oslabs-beta/ReactRelay/assets/103789011/ce172e6b-d0d7-4e0a-87d7-58f0a499c22b)

## Distribution

In order to create a distributable, run `npm run make` in the root directory. This will create a distributable for the all operating systems you have specified in your configuration. You can specify which operating systems you want to create a distributable for by including different makers inside the forge.config.cjs file. For more information on how to create a distributable for different operating systems, visit https://www.electronforge.io/. It is currently set up to create a distributable for MacOS, Windows, and Linux with .zip for Darwin, .exe for Windows, and .deb or .rpm file types for Linux machines.

# Technical challenges and solutions
## Electron and Electron-Vite interacting with Express

The electron app consists of three diffrent folders: The Main, which contains the window for the Electron application which will be displayed to the user, the Preload, which contains the preload script that will be run in the Electron application, and the Renderer, which contains the React application that will be displayed to the user. The Electron application is created in the main.js file in the main folder. The preload script is created in the preload.js file in the preload folder. You can read more about it here: https://www.electronjs.org . Electron-Vite is a chimera of Electron and the Vite bundler. It allows you to use the Vite bundler to bundle your React application and then use Electron to display it to the user. Whenever you are dealing with chimera, there is the possibility for things not working how you might expect because of the changes which have been made to have both applications working together. 

Electron uses its own version of a server in order to perform operations, so express servers aren't naturally compatible with electron applications and would not normally work, but we have found a way to make them work together so that the front and back ends of the application can communicate. Normally in the root server file in an express server you use the app.listen function to listen to a specified port. Instead, we are exporting that express instance  created inside the server.ts fole and importing it into the main folder of the electron application and setting it to listen at a dynamically assigned port. This will allow us to use an express server and its middleware functionality inside of an electron application.

## React-Flow

React-Flow is a data visualization library which allows for the creation of a graph of nodes and edges which we are using to display the relationships between components with each node representing an component inside of a react application and the lines between nodes representing the connections between files. React-Flow is a very helpful library to use, thought there aren't many well-documented examples of its use. React-Flow allows for the creation of custom nodes and node edges and we used this to create custom nodes whos edges reflect the connections between files and whose formatting reflects the content of a file. This is the backbone of the visualization part of our application. The custom nodes are under the components section of our app and can be further customized or to have additional custom nodes added, depending on preference. You can read more about custom nodes in React Flow [here](https://reactflow.dev/docs/api/nodes/custom-nodes/).

## AST Traversal and Parsing

Our application uses the Babel-Parser to expose an uploaded project folder's AST (Abastract Syntax Tree), which normally happens during compile time, to have access to the project's file structure and component hierarchy. This allows us to traverse the AST using Babel Traverse to create a graph of nodes and edges using React Flow's logic which we can then use to create a visualization of the project's file structure and component relationship. Each component is contained within an object which is then destructured indide of Tree.tsx file with the nodes in the graph being populated with information about the clickable node and the edges and connections representing the file connections with the overall graph showing the component interactions and hierarchy with conditional formatting based on whether or not the component contains AJAX calls. You can read more about Babel-Parser [here](https://babeljs.io/docs/en/babel-parser) and Babel-Traverse [here](https://babeljs.io/docs/en/babel-traverse).

## Additional Graph Components

When selecting a component node from our graph, you will be shown a tab with information about the component, including the component's code, the component's AJAX calls, and the component's database schemas. The AJAX calls are displayed next to the database schema of the file, if present. When clicking the "code" tab, you are presented with a code preview of the component. You are also able to search through the graph to quickly locate components. It accmoplishes this by looking through the labels which represent component names and highlights them. Included with the React Flow library are the controls for controlling the view of the graph and navigate through it and having an interactable mini map to navigate the graph. There are also two button components inside of the graph which allow you to change the orientation of the tree.

# Iteration Ideas 

### JavaScript Framework Expansion

The application is currently tested to work on React applications and the components which are used in those libraries. Expanding the converage to include other front-end JavaScript frameworks is an obvious next step for the project starting with Vue and the Angular Framework and possibly expanding the compatibility to include Svelte. There is also preliminary logic for handling the syntax of Next.js files, though it isn't currently far enough along to be implemented. 

### Integrating Other Languages

The AST is a data structure which is used by a wide variety of languages and once you understand the logic of how the AST is organized and you are able to read the information from the compiler or parser from you language which exposes the AST. Once you are able to understand the logic and structure of Abstract Syntax Trees, you should be able to add controllers to the server to account for different languages once they are identified. 

### Adding a SQLite Database

The ability to add a database to the project would be helpful for filtering out edge cases, persisting user data and projects, and persisting the trees which the users have created to be albe to export it or share it. 




### SERVER FOLDER

### CONTROLLER FILES

### fsController 
Uses the fs module to analyze a directory and extract the absolute file paths of all the files in that directory, organized in the **allFiles** array in the res.locals object.


### componentController
The ***parseFile*** method in ***componentController*** serves to analyze the frontend structure and synthesize an object containing information about all the components. A ***components*** object is sent to the frontend, and it is structured as follows:

  ***components***

      { 
        absolute file path: {
          data: { label: component name },
          children: [
            absolute file path of a child component,
            absolute file path of another child component,
          ],
          ajaxRequests: [
            {
              route: name of endpoint not including variables,
              fullRoute: name of endpoint including variables,
              method: method type (GET, POST, etc)
            },
            { potentially another ajax request object }
          ],
          id: absolute file path
        },
        another AFP: { another component object }
      }



The ***getCode*** method in ***componentController*** takes in the absolute file path of a component as a query parameter, and uses the fs module to extract the code from this file and save it to res.locals.componentCode, to be sent back to the frontend.




### serverASTController
The ***parseAll*** method in ***serverASTController*** servers to analyze the server files associated with AJAX requests from the frontend. An array of server-side file paths, ***allFiles***, is iterated through, and the code from each file is converted to an abstract syntax tree using babel parser, then traversed using babel traverse.

The ***traverseServerAST*** function first organizes the file by file type (mongoose model files, controller files, router files, and root server file). Once a file's type has been determined, it is passed in to another function that is specific for that file type:

***traverseServerFile*** analyzes the root server file for incoming endpoints, and organizes the resulting information into 2 objects:
  ***linksToRouter***

      {
        endpoint fragment: AFP of corresponding router file,
        another endpoint frag: another router file AFP
      }


  allServerRoutesLeadingToController

      {
        absolute file path of root: {
          endpoint: {
            method name: [
              {
                path: AFP of file containing middleware method,
                middlewareName: name of middleware method
              },
              {
                potentially another middleware object
              },
            ],
            another method name: [
              another array of middleware objects
            ],
          },
          another endpoint: {
            another endpoint object 
          },
        },
      }


***traverseRouterFile*** analyzes router files for ajax method invocations on an express instance, and packages the corresponding route, as well as its associated chain of middleware functions, into an object called:

  ***allRouterRoutesLeadingToController***

      {
        absolute file path of router: {
          endpoint fragment: {
            method name: [
              {
                path: AFP of file containing middleware method,
                middlewareName: name of middleware method,
              },
              { another middleware object }
            ],
            another method name: [ 
              another array of middleware objects
            ]
          },
          another endpoint fragment: {
            another endpoint object
          },
        }
      }



***traverseControllerFile*** analyzes controller files for middleware methods, and their corresponding interactions with database schemas, populating this information into the ***controllerSchemas*** object:

  ***controllerSchemas***

      {
        absolute file path of current file:
          middleware method name: [
            schema name,
            another schema name,
          ],
          another middleware method name: [
            another array of associated schema names
          ]
      }


***traverseMongooseFile*** analyzes mongoose model files for new Schema instances and their corresponding labels, then uses these labels to determine the names they are exported as, and creates the ***schemaKey*** object from this information:
  ***schemaKey***

      {
        exported schema name: {
          schema object
        },
        another exported schema name: { another schema object }
      }


After traversing all files and populating the above referenced objects, the ***allServerRoutesLeadingToController*** and ***allRouterRoutesLeadingToController*** objects are traversed independently to populate the same ***output*** object that is formatted as follows:

  ***output***

      {
        complete endpoint: {
          CRUD method name: {
            schema name: { schema object },
            another schema name: { another schema object }
          },
          another CRUD method name: { another object of schemas }
        },
        another complete endpoint: { another object of all method calls to this endpoint }
      }


    
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

















