import MethodButton from "@renderer/components/MethodButton";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveRoute } from '../features/detailSlice';
import { RootState } from '../interfaces/stateInterfaces'

function MethodButtonContainer() {
  const [methodButtons, setMethodButtons] = useState<React.ReactElement[]>([]);
  const nodeInfo = useSelector((state: RootState) => state.project.nodeInfo);
  const dispatch = useDispatch();

  console.log('nodeinfo', nodeInfo)

  useEffect(() => {
    const buttons = nodeInfo.map((nodeObj) => (
      <MethodButton
        methodName={nodeObj.method}
        endPointName={nodeObj.fullRoute}
      />
    ));
    setMethodButtons(buttons);
    dispatch(setActiveRoute(Object.keys(nodeInfo).length ? { methodName: nodeInfo[0].method, endPointName: nodeInfo[0].fullRoute } : { methodName: '', endPointName: '' }))
  }, [nodeInfo]);

  return (
    <div className='col-span-5 flex flex-col gap-[1rem] h-min mr-1'>
      {nodeInfo.length !== 0 && methodButtons}
    </div>
  )
  }

  export default MethodButtonContainer;