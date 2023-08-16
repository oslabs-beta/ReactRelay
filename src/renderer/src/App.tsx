// importing tailwind to use in the react components
import 'tailwindcss/tailwind.css'
import Tree from './components/Tree.js';

function App(): JSX.Element {
  return (
    <div className="container mx-auto my-auto grid  grid-rows-3 grid-flow-col gap-4	">
      <header className="grid grid-cols-3	gap-4">
        <h1 className="bg-red-500">React-Relay</h1>
        <h4 id="current-app-name" className="bg-yellow-500">
          My-React-App
        </h4>
        <button id="upload-button" className="open-app bg-violet-500">
          Open App File
        </button>
      </header>

      <div id="tree-container" style={{height: '1000px'}} className="tree-container bg-green-500">
        <Tree />
      </div>

      <div id="details-container">
        <div id="model-container" className="bg-blue-500">
          MODEL CONTAINER
        </div>
      </div>
    </div>
  )
}

export default App
