import Prism from 'prismjs';
import '../assets/prism.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function ModelPreview() {
  const nodeInfo = useSelector(state => state.project.nodeInfo);
  const serverSchemas = useSelector(state => state.project.server);

  useEffect(() => {
  Prism.highlightAll();
  }, [])

  const nodeFullRoutes = nodeInfo.map(obj => obj.fullRoute);
  const nodeRoutes = nodeInfo.map(obj => obj.fullRoute);

  const serverRoutes = Object.keys(serverSchemas).map(route => route);
  const links = {};
  serverRoutes.forEach(route => {
    if (nodeFullRoutes.includes(route)) {
      links[route] = route;
      return;
    };
    const serverRouteArr = route.split('/');
    for (let nodeRoute of nodeFullRoutes) {
      const nodeRouteArr = nodeRoute.split('/');
      if (nodeRouteArr.length !== serverRouteArr.length) continue;
      if (nodeRouteArr[1] === nodeRoute[1]) links[nodeRoute] = route;
    }
  })

  const displays = {};
  nodeInfo.forEach(obj => {
    console.log('nodeInfoObj', obj)
    if (Object.hasOwn(links, obj.fullRoute)) {
      const method = obj.method.toLowerCase();
      const serverRoute = links[obj.fullRoute];
      console.log('serverRoute', serverRoute, 'serverSchemas', serverSchemas)
      if (serverSchemas[serverRoute][method]) {
        const schemasObj = serverSchemas[serverRoute][method];
        Object.keys(schemasObj).forEach(schema => {
          if (displays[obj.fullRoute]) {
            if (displays[obj.fullRoute][method]) {
              displays[obj.fullRoute][method][schema] = schemasObj[schema];
            } else {
              displays[obj.fullRoute][method] = { [schema]: schemasObj[schema] };
            }
          } else {
            displays[obj.fullRoute] = { [method]: { [schema]: schemasObj[schema] } };
          }
        })
      }
    }
  })
  console.log('displays', displays)
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
        
        }
        </code>
      </pre>
    </div>
  )
}

export default ModelPreview