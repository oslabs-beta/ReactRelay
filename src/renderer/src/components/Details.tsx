import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ModelPreview from './ModelPreview';
import MethodButtonContainer from '@renderer/containers/MethodButtonContainer';
import ComponentCode from './ComponentCode'

function Details({ componentName, nodeInfo, treeContainerClick, activeComponentCode }): JSX.Element {
  const [height, setHeight] = useState<string | number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('changeeeeeee', nodeInfo)
    // if (nodeInfo.length) {
      console.log('hey')
      window.innerHeight > 800 ? setHeight('40vh') : setHeight('30vh');
    // } else {
    //   console.log('hooo')
    //   setHeight(0);
    // }
    console.log(height)
  },[nodeInfo])

  useEffect(() => {
    console.log('height', height)
      const newHeight = height > '30vh' ? '20vh' : 0;
      setHeight(newHeight)
  }, [treeContainerClick])

  const handler = (mouseDownEvent) => {
    // const startHeight = height;
    // const startPosition = mouseDownEvent.pageY;
    console.log(mouseDownEvent.pageY, 'mdepy')

    function onMouseMove(mouseMoveEvent) {
      console.log('mme', mouseMoveEvent.pageY)
      const newHeight = window.innerHeight - mouseMoveEvent.pageY;  //startHeight = height of div // startPosition = where the mouse is positioned // mouseMoveEvenet.pageY = detects where mouse is on the screen //pageY is property of mouse event (on y axis unit is in pixels)
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
    <>
      <div id="draggable-container" className={`relative w-full flex flex-col bg-primary rounded-t-lg resize-y mt-9 z-1`}  style={{height: height}} >
        <div id="drag-bar" onMouseDown = {handler} className="pointer-events-auto self-center top-1/2 right-0 -mt-7 p-2 hidden md:block cursor-ns-resize z-3"  draggable="false">
          <div className="w-10 h-2 bg-slate-500/60 rounded-full"></div>
        </div>

        <div className='w-fit'>
          <p className='relative rounded-t-xl text-2xl bg-primary font-bold mt-[-45px] ml-[40px] pl-5 pr-2 p-2 '>
            <div id="label" className="flex w-full items-center	">
              {componentName}
              <div className="tooltip tooltip-secondary tooltip-right" data-tip="toggle component details">
                <p className={`badge cursor-pointer	 text-m rounded-full bg-secondary m-2 ml-10 w-fit px-2` } onClick={() => location.pathname === '/' ? navigate('/code') : navigate('/')}>
                  {location.pathname === '/' ? 'CODE' : 'ROUTES'}
                </p>

              </div>
            </div>
          </p>
        </div>



        <div id='detail-container' className='grid grid-cols-12 overflow-auto h-min mt-10 px-2 gap-[1rem]'>
          <Routes>
            <Route path="/" element={
              <>
                <MethodButtonContainer nodeInfo={nodeInfo}/>
                <ModelPreview />
              </>
            }/>
            <Route path="/code" element={<ComponentCode activeComponentCode={activeComponentCode} />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Details;
