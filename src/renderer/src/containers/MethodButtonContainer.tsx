import MethodButton from "@renderer/components/MethodButton";
import { useState, useEffect } from "react";

function MethodButtonContainer({nodeInfo}) {
  const [methodButtons, setMethodButtons] = useState([]);
  console.log('nodeinfo', nodeInfo)

  useEffect(() => {
    const buttons = nodeInfo.map((nodeObj) => (
      <MethodButton
        methodName={nodeObj.method}
        endPointName={nodeObj.fullRoute}
      />
    ));
    setMethodButtons(buttons);
  }, [nodeInfo]);

  return (
    <div className='col-span-5 flex flex-col gap-[1rem] h-min mr-1'>
      {nodeInfo.length !== 0 && methodButtons}
    </div>
  )
  }

  export default MethodButtonContainer;