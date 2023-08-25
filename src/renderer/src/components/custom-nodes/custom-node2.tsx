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
      className={`custom-node flex flex-column items-center font-semibold bg-slate-100 cursor-pointer min-h-8 max-h-16 p-1 shadow-md bg-blend-normal rounded-lg border-2 border-slate-500 text-xs bg`}
      onClick={() => console.log('clicked', data)}
    >
      <Handle type='target' position={targetPosition} />
      <strong className='label flex-wrap min text-xl'>{label}</strong>
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
