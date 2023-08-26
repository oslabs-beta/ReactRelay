import React, { useEffect } from 'react'
import {
  TERipple,
  TEModal,
  TEModalDialog,
  TEModalContent,
  TEModalHeader,
  TEModalBody,
  TEModalFooter,
} from "tw-elements-react";
import { useSelector, useDispatch } from 'react-redux';
import { addPath } from '../features/projectInfo/addProjectSlice'
import { setComponents } from '../features/projectInfo/reactFlowSlice'

function ProjectPathModal({showFileModal, setShowFileModal}) {

  const dispatch = useDispatch();
  const componentPath = useSelector(state => state.addProject.componentPath)

const dialogConfig = {
      title: 'Select a project',
      buttonLabel: 'Select',
      properties: ['openDirectory']
    }
    // window.api.openDialog returns the filepath when the filepath is chosen from the dialog
    // should i add a case where user doesn't actually select a filepath
    const openFileExplorer = async (pathType): any => { //FIXME: add to type
      const {filePaths} = await window.api.openDialog('showOpenDialog', dialogConfig) //TODO: add to type
      // if user chooses cancel then don't do anything
      if (filePaths[0] === '' || !filePaths[0]) return null;
      dispatch(addPath([pathType, filePaths[0]]));
  }

  const fetchComponents = async (): any => {
    console.log('this is the path', componentPath)
    if (componentPath === '' || !componentPath) return null;
    const response = await fetch('http://localhost:3000/components', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify({ filePath: componentPath })  // sends to the componentController the filepath
    })
    if (response.ok) {
      const res = await response.json()
      dispatch(setComponents(res))
    }
  }



  return (
     <TEModal show={showFileModal} setShow={setShowFileModal}>
       <TEModalDialog className='w-3/5'>
         <TEModalContent>
           <TEModalHeader>
             <h2 className="text-md font-medium leading-normal text-neutral-800 dark:text-neutral-200">Select component src path and server path</h2>
             <button onClick={()=>setShowFileModal(false)}>X</button>
           </TEModalHeader>
           <TEModalBody className='flex flex-col gap-3'>
             <div className=''>
               <label>Components: </label> 
               <input type='text' placeholder='Components file path' value={componentPath}></input>
               <button id='component-folder'className='text-sm bg-slate-300 rounded-md p-1' onClick={()=>openFileExplorer('componentPath')}>Choose folder</button>
             </div>
             <div>
               <label>Server: </label> 
               <input type='text' placeholder='Server file path'></input>
               <button id='server-folder'className='text-sm bg-slate-300 rounded-md p-1' onClick={()=>openFileExplorer('serverPath')}>Choose folder</button>
             </div>
           </TEModalBody>  
           <TEModalFooter>
            <button className='rounded-md bg-slate-200 p-1'>Cancel</button>
            <button onClick={fetchComponents} className='rounded-md bg-primary py-1 px-3'>OK</button>
           </TEModalFooter>     
         </TEModalContent>
       </TEModalDialog>
     </TEModal>    
    

  )
}

export default ProjectPathModal