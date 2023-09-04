import Prism from 'prismjs';
import '../assets/prism.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function ModelPreview() {
  const nodeInfo = useSelector((state: any) => state.project.nodeInfo);
  const serverSchemas = useSelector((state: any) => state.project.server);
  const activeRoute = useSelector((state: any) => state.detail.activeRoute);

  useEffect(() => {
  Prism.highlightAll();
  }, [])

  let display;
  const activeEndpoint = activeRoute.endPointName;
  const activeMethod = activeRoute.methodName.toLowerCase();
  let hasVariable = /\$\{[^ ]+\}/.test(activeEndpoint);

  const serverRoutes = Object.keys(serverSchemas).map(route => route);
  if (hasVariable) {
    display = "variable"
  } else if (serverRoutes.includes(activeEndpoint)) {
    display = "found";
  }

  console.log('aep', activeEndpoint, 'serverRoutes', serverRoutes, 'activeRoute', activeRoute)

  
  console.log('display', display, serverSchemas, 'SSchemas')
  return (
    <div className='col-span-7 overflow-auto h-min '>
      <h3 className="font-bold">Expected Data Structure</h3>
      <pre className='bg-base-100 rounded-md z-2'>
        <code className='language-js'>
        {/* {`const Schema = mongoose.Schema;

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
        `} */}
        {
          display == undefined ? "ROUTE NOT FOUND" : display === "variable" ? "ROUTE IS CONDITIONAL" : display === "found" ? Object.keys(serverSchemas[activeEndpoint][activeMethod]).map(schema => `${schema} ` + JSON.stringify(serverSchemas[activeEndpoint][activeMethod][schema])) : ''
        }
        </code>
      </pre>
    </div>
  )
}

export default ModelPreview