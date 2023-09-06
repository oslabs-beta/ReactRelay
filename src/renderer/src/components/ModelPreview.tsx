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
  let activeEndpoint = activeRoute.endPointName;
  if (/^http:\/\/localhost:\d+\//.test(activeEndpoint)) {
    activeEndpoint = "/" + activeEndpoint.split(/^http:\/\/localhost:\d+\//)[1];
  }
  console.log('activeRoute', activeRoute)
  const activeMethod = activeRoute.methodName ? activeRoute.methodName.toLowerCase() : '';
  let hasVariable = /\$\{[^ ]+\}/.test(activeEndpoint);

  const serverRoutes = Object.keys(serverSchemas).map(route => route);

  console.log(serverRoutes, 'serverRoutes11111', serverSchemas)
  if (hasVariable) {
    display = "variable"
  } else if (activeEndpoint) {
    if (serverRoutes.includes(activeEndpoint)) {
    display = "found";
    } else if (serverRoutes.includes(activeEndpoint + "/")) {
      display = "found";
      activeEndpoint += "/";
      } else if (activeEndpoint[activeEndpoint.length-1] === "/" && serverRoutes.includes(activeEndpoint.slice(0,-1))) {
      display = "found";
      activeEndpoint = activeEndpoint.slice(0,-1);
    }
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
          display === '' ? "SCHEMA NOT FOUND"
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