import {useEffect} from 'react';
import Prism from 'prismjs';
import '../assets/prism.css';


const ComponentCode = ({ activeComponentCode }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [activeComponentCode])



  return (
    <div className='col-span-12 h-min ml-5'>
      <h3>Component Code</h3>
      <pre className='bg-base-100 p-2 rounded-md z-2'>
        <code className='language-js break-words'>
        {activeComponentCode}
        </code>
      </pre>
    </div> 
  )
}

export default ComponentCode;