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
