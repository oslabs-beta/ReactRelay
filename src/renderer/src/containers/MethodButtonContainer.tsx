import MethodButton from "@renderer/components/MethodButton";
import { useState, useEffect } from "react";

function MethodButtonContainer({nodeInfo}) {
  const [methodButtons, setMethodButtons] = useState([]);

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
   <table className='h-fit border-separate border-spacing-y-5 w-7/12'>
      <thead>
        <tr>
          <td>Method</td>
          <td>Endpoint</td>
        </tr>
      </thead>
      <tbody>
        {nodeInfo.length !== 0 && methodButtons}
      </tbody>
    </table>
  )
}

export default MethodButtonContainer