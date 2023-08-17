// importing tailwind to use in the react components
import 'tailwindcss/tailwind.css'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tree from './components/Tree';

function App(): JSX.Element {
    const [projectName, setProjectName] = useState('');
    const [filePath, setFilePath] = useState(''); // may want to change this to some sort of redux, but useState is good for now i guess
    const [reactFlowComponents, setReactFlowComponents] = useState({});
    
    
    // dialog settings
    const dialogConfig = {
    title: 'Select a project',
    buttonLabel: 'Select',
    properties: ['openDirectory']
  }
    // window.api.openDialog returns the filepath when the filepath is chosen from the dialog
    // should i add a case where user doesn't actually select a filepath
    const openExplorer = async (): any => {
      console.log('zzzzzzzzzzzzzz')

      const {filePaths} = await window.api.openDialog('showOpenDialog', dialogConfig)
      // if user chooses cancel then don't do anything
      if (filePaths[0] === '' || !filePaths[0]) return null;
      setFilePath(filePaths[0])
      const fileArray = filePaths[0].split('/')
      setProjectName(fileArray[fileArray.length - 1]);
  }

  // make a post request to backend to access AST logic and create the object with parent/children relationship
  const fetchComponents = async (): any => {
    console.log('what is the file path', filePath)
    if (filePath === '' || !filePath) return null;
    const response = await fetch('http://localhost:3000/components', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify({ filePath })  // sends to the componentController the filepath
    })
    console.log('zzzzzzzzzzzzzz')

    if (response.ok) {
      const res = await response.json()
      setReactFlowComponents(res)
      console.log('qqqqq', reactFlowComponents)
    }
  }
    // need to use the useEffect or else the fetchComponent will run without waiting for the setStates to update
    useEffect(() => {
    fetchComponents();
    }, [filePath])

  return (
    <div className="container grid grid-rows-4 grid-flow-col gap-4 p-0 m-0">
      <Header onClick={openExplorer} projectName={projectName}/>
      <header className="grid grid-cols-3	gap-4">
        <h1 className="bg-red-500">React-Relay</h1>
        <h4 id="current-app-name" className="bg-yellow-500">
          My-React-App
        </h4>
      </header>

      {/* can we put this div inside of the tree */}
      <div id="tree-container" className="container bg-slate-200 h-[1000px] w-full">
        <Tree reactFlowComponents={reactFlowComponents}/>
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
