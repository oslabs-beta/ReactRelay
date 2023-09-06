import Prism from 'prismjs';
import '../assets/prism.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function ModelPreview() {
  const serverSchemas = useSelector((state: any) => state.project.server);
  const activeRoute = useSelector((state: any) => state.detail.activeRoute);

  useEffect(() => {
  Prism.highlightAll();
  }, [activeRoute])

  let display = '';
  let output;
  const activeEndpoint = activeRoute.endPointName;
  const activeMethod = activeRoute.methodName.toLowerCase();
  let hasVariable = /\$\{[^ ]+\}/.test(activeEndpoint);

  const serverRoutes = Object.keys(serverSchemas).map(route => route);

  if (hasVariable) {
    display = "variable"
  } else if (serverRoutes.includes(activeEndpoint)) {
    display = "found";
  }

  if (display === 'found') {
    output = Object.keys(serverSchemas[activeEndpoint][activeMethod]).map(schema => `${schema} ` + JSON.stringify(serverSchemas[activeEndpoint][activeMethod][schema], null, 2)).join('\n');
  }

  console.log('aep', activeEndpoint, 'serverRoutes', serverRoutes, 'activeRoute', activeRoute)

  console.log('display', display)
  return (
    <div className='col-span-7 overflow-auto h-min '>
      <h3 className="font-bold">Expected Data Structure</h3>
      <pre className='bg-base-100 rounded-md z-2'>
        <code className='language-js'>
        {
          display === '' ? "ROUTE NOT FOUND"
          : display === "variable" ? "ROUTE IS CONDITIONAL"
          : display === "found" ? output
          : ''
        }
        </code>
      </pre>
    </div>
  )
}

export default ModelPreview