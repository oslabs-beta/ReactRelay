import { useSelector, useDispatch } from 'react-redux';
import { addPath } from '../features/projectInfo/addProjectSlice'
import { setComponents } from '../features/projectInfo/reactFlowSlice'

function ProjectPathModal() {

  const dispatch = useDispatch();
  const componentPath = useSelector(state => state.addProject.componentPath)
  const serverPath = useSelector(state => state.addProject.serverPath)

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
      console.log('this is the response!', res)
      dispatch(setComponents(res))
    }
  }

  //TODO: ADD FUNCTIONALITY TO BUTTONS!


  return (
  <dialog id="openExplorerModal" className="modal">
    <form method="dialog" className="modal-box">
      <h3 className="font-bold text-lg">Open Project</h3>
      <div id='file-input-container' className='w-full'>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Component Folder</span>
          </label>
            <div className='flex flex-row'>
              <button className='bg-primary p-3 rounded-l-md text-sm font-semibold' onClick={()=>openFileExplorer('componentPath')}> CHOOSE PATH</button>
              <div className='border border-primary rounded-r-md text-sm'>{componentPath !== '' ? componentPath : 'No folder chosen'}</div>
            </div>
        </div>
        <div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Server Folder</span>
            </label>
            <div className='flex flex-row'>
              <button className='bg-primary p-3 rounded-l-md text-sm font-semibold' onClick={()=>openFileExplorer('serverPath')}> CHOOSE PATH</button>
              <div className='border border-primary rounded-r-md text-sm'>{serverPath !== '' ? serverPath : 'No folder chosen'}</div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-between items-end'>
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn bg-error" >Cancel</button>
        </div>
        <div>
          <button onClick={()=>fetchComponents()}className='btn bg-primary'>Continue</button>
        </div>
      </div>

    </form>
  </dialog>

  )
}

export default ProjectPathModal