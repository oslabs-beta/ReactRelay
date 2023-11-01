import React from 'react';
import { Handle } from 'reactflow';
import 'tailwindcss/tailwind.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../interfaces/stateInterfaces';
import { NodeProps, Position } from 'reactflow'

const checkForSearchMatch = (label: string) => {
  return useSelector((state: RootState) => {
    const searchValue = state.search.searchValue.toLowerCase();
    return label.toLowerCase().includes(searchValue) ? searchValue : null;
  }, (a,b) => a === b)
}

const CustomNode2 = React.memo<NodeProps>(({ data, sourcePosition, targetPosition }) => {
  const { label } = data;
  const searchValue = checkForSearchMatch(label);

  return (
    <div
      className={`custom-node flex flex-column items-center  ${
        searchValue ? 'bg-accent' : data.active ? 'bg-secondary text-xl' : 'bg-slate-100 text-xl'
      } cursor-pointer min-h-4 max-h-16 p-1 shadow-md bg-blend-normal rounded-lg border-2 border-slate-500 bg`}
    >
      <Handle type='target' position={targetPosition || Position.Left} />
      <p className='label flex-wrap min text-3xl'>{label}</p>
      <Handle
        type='source'
        position={sourcePosition || Position.Right}
        id='a'
        className='source-handle '
      />
    </div>
  );
});

export default CustomNode2;
