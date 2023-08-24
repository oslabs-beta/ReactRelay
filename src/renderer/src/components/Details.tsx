import { useState, useEffect } from 'react';
import ModelPreview from './ModelPreview';
import MethodButtonContainer from '@renderer/containers/MethodButtonContainer';

function Details({ componentName, nodeInfo }): JSX.Element {
  const [height, setHeight] = useState(200);

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
      <div id="draggable-container" className={`absolute bottom-0 min-h-[4rem] max-h-min mb-[-15rem] w-full flex flex-col bg-primary rounded-t-lg resize-y mt-9 z-1`}  style={{height: `${height}px`, maxHeight: '700px'}}>
        <div id="drag-bar" onMouseDown = {handler} className="pointer-events-auto self-center top-1/2 right-0 -mt-7 p-2 hidden md:block cursor-ns-resize z-3"  draggable="false">
          <div className="w-10 h-2 bg-slate-500/60 rounded-full"></div>
        </div>
        <h1 id="component-tab-label" className='inline rounded-t-xl text-2xl bg-primary font-bold mt-[-48px] ml-[40px] px-8 pt-4 pb-1 w-fit'>{componentName}</h1>
        { nodeInfo.length !== 0 &&
        <div id='detail-container' className='grid grid-cols-12 h-min mt-10 p-10 gap-[1rem]'>
          <MethodButtonContainer nodeInfo={nodeInfo}/>
          <ModelPreview />
        </div>}
      </div>
    </div>
  );
}

export default Details;
