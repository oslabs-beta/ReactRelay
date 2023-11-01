import {useEffect} from 'react';
import Prism from 'prismjs';
import '../assets/prism.css';
import { useSelector } from 'react-redux';
import { RootState } from '../interfaces/stateInterfaces';

const ComponentCode = () => {
  const activeComponentCode = useSelector((state: RootState) => state.detail.activeComponentCode)
  useEffect(() => {
    Prism.highlightAll();
  }, [activeComponentCode])


  return (
    <div className='col-span-12 h-min bg-neutral p-4 rounded-xl'>
      <h3 className="font-bold">Component Code</h3>
      <pre className='bg-base-100 p-2 rounded-md z-2'>
        <code className='language-js break-words'>
        {activeComponentCode}
        </code>
      </pre>
    </div>
  )
}

export default ComponentCode;