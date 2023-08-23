// Path: src/renderer/src/components/CustomNodes.jsx
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import 'tailwindcss/tailwind.css';
const handleStyle = { //why is this decalred but never read
  left: 10,
  style: 'bg-primary',
};

const CustomNode = ({ data }) => {
  const { label } = data;

  return (
    <div
      className='custom-node bg-primary cursor-pointer min-h-4 p-1 shadow-md bg-blend-normal rounded-md border-2 border-slate-500 text-xs bg'
    >
      {/* Handle are the dotes on the edge of the node where the lines connect */}
      <Handle type='target' position={Position.Left} />
      <div>
        <strong className='label flex-wrap min '>{label}</strong>
      </div>
      <Handle
        type='source'
        position={Position.Right}
        id='a'
        className='source-handle'
        style={handleStyle}
      />
      {/* <button className='button bg-blue-300'>GET</button> */}
    </div>
  );
};

export default memo(CustomNode);