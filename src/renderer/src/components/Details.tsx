import MethodButton from "./MethodButton"
import { useState, useEffect } from "react";

function Details({ componentName, nodeInfo }): JSX.Element  {
  const [methodButtons, setMethodButtons] = useState([]);
  // is this where we are gonna wanna start using redux, to keep track of file path state?

  useEffect(() => {
    const buttons = nodeInfo.map(nodeObj => <MethodButton methodName={nodeObj.method} endPointName={nodeObj.fullRoute}/>)
    setMethodButtons(buttons);
  }, [nodeInfo])

  return (
    <div>
      <h1 className='text-3xl font-bold ml-6 mb-4'>{componentName}</h1>
      <div id='method-btn-container' className="flex flex-col gap-3 ml-5 w-fit">
        {nodeInfo.length !== 0 && methodButtons}
      </div>
    </div>
  )
}

export default Details;