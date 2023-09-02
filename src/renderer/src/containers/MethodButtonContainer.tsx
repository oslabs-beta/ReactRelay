import MethodButton from "../components/MethodButton";
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

  export default MethodButtonContainer
  //  <table className='h-fit border-separate border-spacing-y-5 w-7/12'>
  //     <thead>
  //       <tr>
  //         <td>Method</td>
  //         <td>Endpoint</td>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       {nodeInfo.length !== 0 && methodButtons}
  //     </tbody>
  //   </table>