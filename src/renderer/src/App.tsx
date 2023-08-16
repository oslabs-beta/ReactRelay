// importing tailwind to use in the react components
import 'tailwindcss/tailwind.css'
import { useState } from 'react'
import Header from './components/Header'

function App(): JSX.Element {

    const [filePath, setFilePath] = useState(''); // may want to change this to some sort of redux, but useState is good for now i guess
    // dialog settings
    const dialogConfig = {
    title: 'Select a project',
    buttonLabel: 'Select',
    properties: ['openDirectory']
  }
    // window.api.openDialog returns the filepath when the filepath is chosen from the dialog
  const openExplorer = async (): any => {
    const {filePaths} = await window.api.openDialog('showOpenDialog', dialogConfig)
    const fileArray = filePaths[0].split('/')
    setFilePath(fileArray[fileArray.length - 1]);
    console.log(filePaths[0]);  // returns an array, so indexed at 0 to retrieve path
  }

  return (
    <div className="container grid grid-rows-4 grid-flow-col gap-4 p-0 m-0">
      <Header onClick={openExplorer} projectName={filePath}/>
      <header className="grid grid-cols-3	gap-4">
        <h1 className="bg-red-500">React-Relay</h1>
        <h4 id="current-app-name" className="bg-yellow-500">
          My-React-App
        </h4>
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
