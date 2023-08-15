import '../../../dist/output.css'
// import './assets/index.css'
function App(): JSX.Element {
  return (
    <div className="container mx-auto my-auto grid  grid-rows-3 grid-flow-col gap-4	">
      <header className="grid grid-cols-3	gap-4">
        <h1 className="bg-red-500">ReactRelay</h1>
        <h4 id="current-app-name" className="bg-yellow-500">
          My-React-App
        </h4>
        <button id="upload-button" className="bg-orange-500">
          Open App File
        </button>
      </header>

      <div id="tree-container" className="bg-green-500">
        TREE CONTAINER
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
