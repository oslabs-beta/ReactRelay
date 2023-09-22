import { useSelector, useDispatch } from 'react-redux';
import { addPath, setComponents, setServer } from '../features/projectSlice'
import { Window, } from '../interfaces/Interfaces';
function ProjectPathModal() {

  const dispatch = useDispatch();
  const componentPath = useSelector((state: any) => state.project.componentPath)
  const serverPath = useSelector((state: any) => state.project.serverPath)

  const dialogConfig = {
      title: 'Select a project',
      buttonLabel: 'Select',
      properties: ['openDirectory']
    }
    // window.api.openDialog returns the filepath when the filepath is chosen from the dialog
    // should i add a case where user doesn't actually select a filepath
    const openFileExplorer = async (pathType): Promise<any> => { //FIXME: add to type
      const {filePaths} = await (window as Window).api.openDialog('showOpenDialog', dialogConfig) //TODO: add to type
      // if user chooses cancel then don't do anything
      if (filePaths[0] === '' || !filePaths[0]) return null;
      dispatch(addPath([pathType, filePaths[0]]));
  }

  const postPath = async (pathType, path): Promise<any> => {
    if (path === '' || !path) return null;
    console.log('componentPath', pathType, path)
    const endpoint = {
      component: `components`,
      server: `server`
    }
    const response = await (window as any).api.send(endpoint[pathType], { filePath: path })  // sends to the componentController or serverASTController the filepath
    console.log('response', response)
    if (response.status >=200 && response.status < 300) {
      console.log('pathtype:', pathType, 'path:', path, 'res:', response.data)
      if (pathType === 'component') dispatch(setComponents(response.data));
      else if (pathType === 'server') dispatch(setServer(response.data));
    }
  }

  const onContinue = () => {
    console.log('component', componentPath)
    postPath('component', componentPath);
    postPath('server', serverPath);
    (window as any).openExplorerModal.close();
  }

  return (
  <dialog id="openExplorerModal" className="modal">
    <div  className="modal-box">
      <h3 className="font-bold text-lg">Open Project</h3>
      <div id='file-input-container' className='w-full'>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Component Folder</span>
          </label>
            <div className='flex flex-row'>
              <button className='btn bg-primary p-3 rounded-l-md rounded-r-none text-sm font-semibold' onClick={()=>openFileExplorer('componentPath')}> CHOOSE PATH</button>
              <div className='flex border border-primary rounded-r-md text-sm '>
                <p className='p-3'>
                {componentPath !== '' ? componentPath : 'No folder chosen'}
                </p>
              </div>
            </div>
        </div>
        <div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Server Folder</span>
            </label>
            <div className='flex flex-row'>
              <button className='btn bg-primary p-3 rounded-l-md rounded-r-none text-sm font-semibold' onClick={()=>openFileExplorer('serverPath')}> CHOOSE PATH</button>
              <div className='border border-primary rounded-r-md text-sm'>  <p className='p-3'>
                {serverPath !== '' ? serverPath : 'No folder chosen'}
                </p></div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-between items-end'>
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn bg-error" onClick={()=>(window as any).openExplorerModal.close()}>Cancel</button>
        </div>
        <div>
          <button onClick={()=>onContinue()} className='btn bg-primary'>Continue</button>
        </div>
      </div>

    </div>
  </dialog>

  )
}

export default ProjectPathModal