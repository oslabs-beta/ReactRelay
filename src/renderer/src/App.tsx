import 'tailwindcss/tailwind.css'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tree from './components/Tree'

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
    const openFileExplorer = async (): any => { //FIXME: add to type
      const {filePaths} = await window.api.openDialog('showOpenDialog', dialogConfig) //TODO: add to type
      // if user chooses cancel then don't do anything
      if (filePaths[0] === '' || !filePaths[0]) return null;
      setFilePath(filePaths[0])
      const fileArray = filePaths[0].split('/')
      setProjectName(fileArray[fileArray.length - 1]);
  }

  // make a post request to backend to access AST logic and create the object with parent/children relationship
  const fetchComponents = async (): any => {
    if (filePath === '' || !filePath) return null;
    const response = await fetch('http://localhost:3000/components', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify({ filePath })  // sends to the componentController the filepath
    })
    if (response.ok) {
      const res = await response.json()
      setReactFlowComponents(res)
      // console.log('reactFlowComponents response is ok', reactFlowComponents)
    }
    // TODO: add error catching !!!!!!!!!!!!!
  }
    // need to use the useEffect or else the fetchComponent will run without waiting for the setStates to update
    useEffect(() => {
    fetchComponents();
    }, [filePath])

  return (
      <Tree reactFlowComponents={reactFlowComponents} openFileExplorer={openFileExplorer} projectName={projectName} />
  )
}

export default App
