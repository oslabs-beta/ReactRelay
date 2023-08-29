// Path: src/renderer/src/components/CustomNodes.jsx
import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import 'tailwindcss/tailwind.css';
const handleStyle = {
  //why is this decalred but never read
  left: 10,
  style: 'bg-primary',
};

const CustomNode = ({ data, sourcePosition, targetPosition }) => {
  const { label } = data;

  return (
    <div
      className={`custom-node flex font-semibold ${
        data.active ? 'bg-secondary' : 'bg-primary'
      } cursor-pointer  p-1 shadow-md bg-blend-normal rounded-lg border-2 border-slate-500`}
    >
      {/* Handle are the dotes on the edge of the node where the lines connect */}
      <Handle type='target' position={targetPosition} />
      <p
        className={`custom-node flex flex-column items-center ${
          data.active
            ? 'label flex-wrap min text-3xl font-extrabold'
            : 'label flex-wrap min text-3xl font-normal'
        } cursor-pointer`}
      >
        {label}
      </p>
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
