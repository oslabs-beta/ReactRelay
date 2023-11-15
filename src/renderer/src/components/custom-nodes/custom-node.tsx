// Path: src/renderer/src/components/CustomNodes.jsx
import React from 'react';
import { Handle } from 'reactflow';
import 'tailwindcss/tailwind.css';
import { useSelector } from 'react-redux';
import { RootState } from '@renderer/interfaces/stateInterfaces';
import { NodeProps, Position } from 'reactflow';

const checkForSearchMatch = (label: string) => {
  return useSelector((state: RootState) => {
    const searchValue = state.search.searchValue.toLowerCase();
    return label.toLowerCase().includes(searchValue) ? searchValue : null;
  }, (a,b) => a === b)
}


const CustomNode = React.memo<NodeProps>(({ data, sourcePosition, targetPosition }) => {
  const { label } = data;
  const searchValue = checkForSearchMatch(label.toLowerCase());
  console.log('sourcePosition', typeof sourcePosition, 'targetPos', targetPosition)
  
  return (
    <div
      className={`custom-node flex flex-column items-center font-normal ${
        searchValue ? 'bg-accent' : data.active ? 'bg-secondary' : 'bg-primary '
      } cursor-pointer min-h-4 max-h-16 p-1 w-fit shadow-md bg-blend-normal rounded-lg border-2 border-slate-500`}
    >
      {/* Handle are the dotes on the edge of the node where the lines connect */}
      <Handle type='target' position={targetPosition || Position.Left} />
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
        position={sourcePosition || Position.Right}
        id='a'
        className='source-handle'
      />
    </div>
  );
});

export default CustomNode;
