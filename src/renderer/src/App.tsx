// importing tailwind to use in the react components
import 'tailwindcss/tailwind.css'

function App(): JSX.Element {
    // dialog settings
    const dialogConfig = {
    title: 'Select a project',
    buttonLabel: 'Select',
    properties: ['openDirectory']
  }
    // window.api.openDialog returns the filepath when the filepath is chosen from the dialog
  const openExplorer = async (): any => {
    const {filePaths} = await window.api.openDialog('showOpenDialog', dialogConfig)
    console.log(filePaths[0]);  // returns an array, so indexed at 0 to retrieve path
  }

  return (
    <div className="container mx-auto my-auto grid  grid-rows-3 grid-flow-col gap-4	">
      <header className="grid grid-cols-3	gap-4">
        <h1 className="bg-red-500">React-Relay</h1>
        <h4 id="current-app-name" className="bg-yellow-500">
          My-React-App
        </h4>
        <button id="upload-button" className="open-app bg-violet-500" onClick={openExplorer}>
          Open App File
        </button>
      </header>

      <div id="tree-container" className="tree-container bg-green-500">
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
