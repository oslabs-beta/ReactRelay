import React from 'react'
import {
  TERipple,
  TEModal,
  TEModalDialog,
  TEModalContent,
  TEModalHeader,
  TEModalBody,
  TEModalFooter,
} from "tw-elements-react";

function ProjectPathModal({showFileModal, setShowFileModal, setComponentPath, setServerPath}) {

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
      if (pathType === 'component') setComponentPath(filePaths[0])
      else setServerPath(filePaths[0])
      console.log(filePaths[0])
  }


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



  return (
      // <TEModal show={showFileModal} setShow={setShowFileModal}>
      //   <TEModalDialog className='w-3/5'>
      //     <TEModalContent>
      //       <TEModalHeader>
      //         <h2 className="text-md font-medium leading-normal text-neutral-800 dark:text-neutral-200">Select component src path and server path</h2>
      //         <button onClick={()=>setShowFileModal(false)}>X</button>
      //       </TEModalHeader>
      //       <TEModalBody className='flex flex-col gap-3'>
              // <div className=''>
              //   <label>Components: </label>
              //   <input type='text' placeholder='Components file path'></input>
              //   <button id='component-folder'className='text-sm bg-slate-300 rounded-md p-1' onClick={openFileExplorer}>Choose folder</button>
              // </div>
              // <div>
              //   <label>Server: </label>
              //   <input type='text' placeholder='Server file path'></input>
              //   <button id='server-folder'className='text-sm bg-slate-300 rounded-md p-1' onClick={openFileExplorer}>Choose folder</button>
              // </div>
      //       </TEModalBody>
      //       <TEModalFooter>
      //         <button className='rounded-md bg-slate-200 p-1'>Cancel</button>
      //         <button className='rounded-md bg-primary py-1 px-3'>OK</button>
      //       </TEModalFooter>
      //     </TEModalContent>
      //   </TEModalDialog>
      // </TEModal>
      // <dialog id="my_modal_1" className="modal">
  <dialog id="openExplorerModal" className="modal">
    <form method="dialog" className="modal-box">
      <h3 className="font-bold text-lg">Open Project</h3>
      <div id='file-input-container' className='w-full'>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Component Folder</span>
          </label>
          <input type="file" className="file-input file-input-primary w-full file-input-bordered file-input-md max-w-xs" onClick={openFileExplorer}/>
        </div>
        <div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Server Folder</span>
            </label>
            <input type="file" className="file-input file-input-primary file-input-bordered file-input-md w-full max-w-xs" />
            <label className="label">
            </label>
          </div>
        </div>
      </div>
      <div className='flex justify-between items-end'>
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn bg-error" >Cancel</button>
        </div>
        <div>
          <button className='btn bg-primary'>Continue</button>
        </div>
      </div>

    </form>
  </dialog>

  )
}

export default ProjectPathModal