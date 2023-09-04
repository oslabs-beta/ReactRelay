import MethodButton from "@renderer/components/MethodButton";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveRoute } from '../features/detailSlice';

function MethodButtonContainer() {
  const [methodButtons, setMethodButtons] = useState([]);
  const nodeInfo = useSelector((state: any) => state.project.nodeInfo);
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
    if (Object.keys(nodeInfo).length) dispatch(setActiveRoute({ methodName: nodeInfo[0].method, endPointName: nodeInfo[0].fullRoute }))
  }, [nodeInfo]);

  return (
    <div className='col-span-5 flex flex-col gap-[1rem] h-min mr-1'>
      {nodeInfo.length !== 0 && methodButtons}
    </div>
  )
  }

  export default MethodButtonContainer;