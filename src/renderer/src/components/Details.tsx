import MethodButton from './MethodButton';
import { useState, useEffect } from 'react';
import ModelPreview from './ModelPreview';

function Details({ componentName, nodeInfo }): JSX.Element {
  const [methodButtons, setMethodButtons] = useState([]);
  const [height, setHeight] = useState(200);

  useEffect(() => {
    const buttons = nodeInfo.map((nodeObj) => (
      <MethodButton
        methodName={nodeObj.method}
        endPointName={nodeObj.fullRoute}
      />
    ));
    setMethodButtons(buttons);
  }, [nodeInfo]);
  
  const handler = (mouseDownEvent) => {
    const startHeight = height;
    const startPosition = mouseDownEvent.pageY;

    function onMouseMove(mouseMoveEvent) {
      const newHeight = startHeight + startPosition - mouseMoveEvent.pageY;  
      console.log('start:', startHeight, ' position:', startPosition, 'mouse: ', mouseMoveEvent.pageY)    
      setHeight(newHeight)
      console.log(height, newHeight);
    }

    function onMouseUp() {
      console.log('mouse up')
      window.document.body.removeEventListener('mousemove', onMouseMove)
      window.document.body.removeEventListener('mouseup', onMouseUp)
      console.log('removed')
    }

    window.document.body.addEventListener("mousemove", onMouseMove);
    window.document.body.addEventListener("mouseup", onMouseUp);
  }
  // is this where we are gonna wanna start using redux, to keep track of file path state?



  return (
    <div className='w-full'>
    <div className={`absolute bottom-0 w-full flex flex-col bg-primary rounded-t-xl resize-y mt-9 bottom-0 z-5`} id='resize' style={{height: `${height}px`}}>
      <div onMouseDown = {handler} className="pointer-events-auto self-center top-1/2 right-0 -mt-7 p-2 hidden md:block cursor-ns-resize"  draggable="false">
        <div className="w-8 h-1.5 bg-slate-500/60 rounded-full"></div>
      </div>
      <h1 className='text-3xl font-bold ml-8 mt-8'>{componentName}</h1>
      <div className='flex justify-center gap-[8rem] h-full mt-10'>
        <div id='method-btn-container' className='flex flex-col gap-3 w-fit'>
        {nodeInfo.length !== 0 && methodButtons}
        </div>
        <ModelPreview />
      </div>


    </div>
    </div>
  );
}

export default Details;
