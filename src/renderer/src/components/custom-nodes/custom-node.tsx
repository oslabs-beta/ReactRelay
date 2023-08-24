// Path: src/renderer/src/components/CustomNodes.jsx
import React, { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import 'tailwindcss/tailwind.css';
const handleStyle = {
  left: 10,
  style: 'bg-primary',
};

const CustomNode = ({ data, sourcePosition, targetPosition, ajaxRequests }) => {
  const { label } = data;
  console.log(ajaxRequests);
  return (
    <div
      className={`custom-node flex flex-column items-center font-semibold bg-primary cursor-pointer min-h-4 max-h-8 p-1 shadow-md bg-blend-normal rounded-lg border-2 border-slate-500 text-xs bg`}
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

export default memo(CustomNode);
