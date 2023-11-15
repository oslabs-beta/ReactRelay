import Prism from 'prismjs';
import '../assets/prism.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../interfaces/stateInterfaces';

function ModelPreview() {
  const serverSchemas = useSelector((state: RootState) => state.project.server);
  const activeRoute = useSelector((state: RootState) => state.detail.activeRoute);

  //use Prism API to highlight the displayed schemas
  useEffect(() => {
  Prism.highlightAll();
  }, [activeRoute])

  let display = '';
  let output;
  let activeEndpoint = activeRoute.endPointName;

  //handle edge-case of the AJAX call on the front-end explicitly including the local host address. 
  if (/^http:\/\/localhost:\d+\//.test(activeEndpoint)) {
    activeEndpoint = "/" + activeEndpoint.split(/^http:\/\/localhost:\d+\//)[1];
  }
  console.log('activeRoute', activeRoute)
  const activeMethod = activeRoute.methodName ? activeRoute.methodName.toLowerCase() : '';

  //check if the selected AJAX endpoint is conditional (i.e. contains a variable)
  let hasVariable = /\$\{[^ ]+\}/.test(activeEndpoint);

  const serverRoutes = Object.keys(serverSchemas).map(route => route);


  //if an endpoint exists and contains no variable, check if there are corresponding server-side interactions with DB schemas. if so, reassign display var to "found".
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

  //if the AJAX request was found server-side, and contains a schema(s), iterate through the schemas for that AJAX request in the 'serverSchemas' object and add them to the 'output' variable as an array of strings to be displayed on right side of the details container.
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