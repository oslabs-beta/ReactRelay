// Path: src/renderer/src/components/CustomNodes.jsx
import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import 'tailwindcss/tailwind.css';
const handleStyle = {
  left: 10,
  style: 'bg-primary',
};

const CustomNode = ({ data }) => {
  const { label } = data;

  return (
    <div
      className={`custom-node bg-primary cursor-pointer min-h-4 p-1 shadow-md bg-blend-normal rounded-md border-2 border-slate-500 text-xs bg`}
      onClick={() => console.log('clicked', data)}
    >
      <Handle type='target' position={Position.Left} />
      <div>
        <strong className='label flex-wrap min '>{label}</strong>
      </div>
      <Handle
        type='source'
        position={Position.Right}
        id='a'
        className='source-handle '
      />
      {/* <button className='button bg-blue-300'>GET</button> */}
    </div>
  );
};

export default memo(CustomNode);
