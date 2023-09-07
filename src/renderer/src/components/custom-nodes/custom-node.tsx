// Path: src/renderer/src/components/CustomNodes.jsx
import React, { useMemo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import 'tailwindcss/tailwind.css';
import { useSelector } from 'react-redux';

interface NodeProps {
  data: {
    label: string,
    active: boolean,
  };
  sourcePosition: {
    x: number,
    y: number,
  };
  targetPosition: number,
}

const handleStyle = {
  //why is this decalred but never read
  left: 10,
  style: 'bg-primary',
};

const checkForSearchMatch = (label: string) => {
  return useSelector((state: any) => {
    const searchValue = state.search.searchValue;
    return label.includes(searchValue) ? searchValue : null;
  }, (a,b) => a === b)
}

const CustomNode = React.memo<NodeProps>(({ data, sourcePosition, targetPosition }) => {
  const { label } = data;
  const searchValue = checkForSearchMatch(label);
  // const shouldReRender = useMemo(() => {
  //   if (searchValue) return label.includes(searchValue);
  //   return false;
  // }, [searchValue]);

  console.log(label.includes(searchValue));

  return (
    <div
      className={`custom-node flex flex-column items-center font-normal ${
        searchValue ? 'bg-accent' : data.active ? 'bg-secondary' : 'bg-primary '
      } cursor-pointer min-h-4 max-h-16 p-1 w-fit shadow-md bg-blend-normal rounded-lg border-2 border-slate-500`}
    >
      {/* Handle are the dotes on the edge of the node where the lines connect */}
      <Handle type='target' position={targetPosition} />
      <p
        className={`custom-node flex flex-column items-center ${
          data.active
            ? 'label flex-wrap min text-3xl font-extrabold'
            : 'label flex-wrap min text-3xl'
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
});

export default CustomNode;
