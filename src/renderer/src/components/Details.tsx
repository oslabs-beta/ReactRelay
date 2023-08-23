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
      const newHeight = startHeight + startPosition - mouseMoveEvent.pageY;  //startHeight = height of div // startPosition = where the mouse is positioned // mouseMoveEvenet.pageY = detects where mouse is on the screen //pageY is property of mouse event (on y axis unit is in pixels)
      // console.log('start:', startHeight, ' position:', startPosition, 'mouse: ', mouseMoveEvent.pageY)    
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
    <div className='h-auto w-full'>
      <div id="draggable-container"className={`absolute bottom-0 min-h-[4rem] mb-[-15rem] h-full w-full flex flex-col bg-primary rounded-t-lg resize-y mt-9 z-1`}  style={{height: `${height}px`}}>
        <div id="drag-bar" onMouseDown = {handler} className="pointer-events-auto self-center top-1/2 right-0 -mt-7 p-2 hidden md:block cursor-ns-resize"  draggable="false">
          <div className="w-10 h-2 bg-slate-500/60 rounded-full z-2"></div>
        </div>
        <h1 id="component-tab-label" className='inline rounded-t-xl text-2xl bg-primary font-bold mt-[-50px] ml-[40px] px-8 pt-5 pb-1 w-fit'>{componentName}</h1>
        <div className='flex justify-center gap-[30rem] h-full mt-10'>
          <div id='method-btn-container' className='flex flex-col gap-3 w-fit'>
          {nodeInfo.length !== 0 && methodButtons}
        </div >
          <ModelPreview />
        </div>
      </div>
    </div>
  );
}

export default Details;
