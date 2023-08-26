// Path: src/renderer/src/components/CustomNodes.jsx
import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import 'tailwindcss/tailwind.css';
const handleStyle = { //why is this decalred but never read
  left: 10,
  style: 'bg-primary',
};

const CustomNode = ({ data, sourcePosition, targetPosition }) => {
  const { label } = data;
  console.log('activeid', data.nodeInfo)

  // const handleClick = () => {
  //   setActive(true);
  // }

  // useEffect(() => setActive(false),[data.nodeInfo])

  return (
    <div
      className={`custom-node flex flex-column items-center font-semibold ${data.active ? 'bg-green-500 text-xl' : 'bg-primary text-xs'} cursor-pointer min-h-4 max-h-8 p-1 shadow-md bg-blend-normal rounded-lg border-2 border-slate-500 bg`}
    >
      {/* Handle are the dotes on the edge of the node where the lines connect */}
      <Handle type='target' position={targetPosition} />
      <strong className='label flex-wrap min '>{label}</strong>
      <Handle
        type='source'
        position={sourcePosition}
        id='a'
        className='source-handle'
      />
    </div>
  );
};

export default memo(CustomNode);