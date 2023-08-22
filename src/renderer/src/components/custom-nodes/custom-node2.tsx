import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
const handleStyle = {
  left: 10,
};
import 'tailwindcss/tailwind.css';

const CustomNode2 = ({ data }) => {
  const { label } = data;

  return (
    <div
      className={` bg-secondary cursor-pointer min-h-4 p-1 shadow-md bg-blend-normal rounded-md border-2 border-slate-500 text-xs bg`}
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

export default memo(CustomNode2);
