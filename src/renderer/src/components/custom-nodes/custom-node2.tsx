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
      className={`custom-node flex flex-column items-center  ${
        data.active ? 'bg-secondary text-xl' : 'bg-slate-100 text-xl'
      } cursor-pointer min-h-4 max-h-16 p-1 shadow-md bg-blend-normal rounded-lg border-2 border-slate-500 bg`}
    >
      <Handle type='target' position={targetPosition} />
      <p className='label flex-wrap min text-3xl'>{label}</p>
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
