import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
const handleStyle = {
  left: 10,
};
import 'tailwindcss/tailwind.css';

const CustomNode2 = ({ data, sourcePosition, targetPosition }) => {
  const { label } = data;

  return (
    <div
      className={`custom-node flex flex-column items-center font-semibold ${ data.active ? 'bg-green-500 text-xl' : 'bg-slate-100 text-xs' } cursor-pointer min-h-4 max-h-8 p-1 shadow-md bg-blend-normal rounded-lg border-2 border-slate-500 bg`}
      onClick={() => console.log('clicked', data)}
    >
      <Handle type='target' position={targetPosition} />
      <strong className='label flex-wrap min '>{label}</strong>
      <Handle
        type='source'
        position={sourcePosition}
        id='a'
        className='source-handle '
      />
    </div>
  );
};

export default memo(CustomNode2);
