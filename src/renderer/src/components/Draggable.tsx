import { useEffect,  useRef, useState } from "react"

function Draggable() {
  // mousemove evnt for when you are inside of the desired hotspot
  // mouseup event when button on a pointing device is release while pointer is located inside of it 



  
  return (

    <div className={`flex flex-col bg-accent resize-y mt-9 border-4 border-fuchsia-500 bottom-0 z-5`} id='resize' style={{height: `${height}px`}}>
      <div onMouseDown = {handler} className="pointer-events-auto self-center top-1/2 right-0 -mt-7 p-2 hidden md:block cursor-ns-resize"  draggable="false">
        <div className="w-8 h-1.5 bg-slate-500/60 rounded-full"></div>
      </div>
      <h1 className='text-3xl font-bold ml-6 mb-4 mt-8'>hello</h1>
      <div id='method-btn-container' className={`flex flex-col gap-3 ml-5 w-fit`}>
        Hello
      </div>
    </div>
  )
}

export default Draggable