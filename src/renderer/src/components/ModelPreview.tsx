import Prism from 'prismjs';
import '../assets/prism.css';
import { useEffect } from 'react';

function ModelPreview() {
  useEffect(() => {
  Prism.highlightAll();
  }, [])

  return (
    <div className='col-span-7 h-min ml-5'>
    <h3>Expected Data Structure</h3>
    <pre className='bg-base-100 rounded-md z-2'>
      <code className='language-js'>
      {`const Schema = mongoose.Schema;

const billSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
});
      `}
      </code>
    </pre>
    </div> 
  )
}

export default ModelPreview