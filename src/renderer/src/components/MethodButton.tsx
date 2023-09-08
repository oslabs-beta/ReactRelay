const { ipcRenderer } = window.require('electron');
const port = ipcRenderer.sendSync('get-port');
import { useDispatch } from "react-redux";
import { setActiveRoute } from '../features/detailSlice';

const MethodButton = ({methodName, endPointName}) => {
  const dispatch = useDispatch();

  const infoObj = {
    methodName,
    endPointName
  }

  //FIXME: colors are a bit hard to read
  const colorCode = {
    'GET': 'bg-[#579972]',
    'POST': 'bg-[#f2cc44]',
    'PUT': 'bg-[#6ea2e6]',
    'PATCH': 'bg-[#b49ed3]',
    'DELETE': 'bg-[#f79a8d]'
  }


  const testClick = () => {
    dispatch(setActiveRoute(infoObj));
    console.log('Method: ', methodName, ' Endpoint: ', endPointName);
  }

  return (
    <div>
          <div className="flex w-full lg:flex-row card bg-neutral p-2 min-w-min	hover:cursor-pointer" onClick={() => testClick()}>
            <div className={`flex badge place-items-center font-extrabold w-fit  ${colorCode[methodName]} p-4 ml-3 mt-2`}>
              {methodName}
            </div>
            <div className="divider divider-horizontal p-0"></div>
            <div className="grid flex-grow h-fit card rounded-box place-items-center break-all p-4">{endPointName}</div>
          </div>
    </div>
  )
}

export default MethodButton