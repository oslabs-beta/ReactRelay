import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import dagre from 'dagre';
import horizontal from '../assets/images/flowchart-horizontal.png'
import vertical from '../assets/images/flowchart-vertical.png'

// import { initialNodes, initialEdges } from '../nodes-edges.js';

import 'reactflow/dist/style.css';
import Details from './Details';
// import { get } from 'mongoose';

// const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';

// const initialNodes = [];
// const initialEdges = [];

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

// const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
//   initialNodes,
//   initialEdges
// );

type Component = {
  id: string;
  data: any;
  children: string[];
};

type Node = {
  id: string;
  data: any;
  position: { x: number, y: number };
};

type Edge = {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
};

function Tree({ reactFlowComponents }): JSX.Element {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeInfo, setNodeInfo] = useState([]);
  const [componentName, setComponentName] = useState('')
  useEffect(() => {
    if (!reactFlowComponents) return;
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    (Object.values(reactFlowComponents) as Component[]).forEach((obj: Component) => {
      newNodes.push({ id: obj.id, data: obj.data, position: { x: 0, y: 0 } })
      obj.children.forEach(childId => {
        newEdges.push({ id: (obj.id).concat(childId), source: obj.id, target: childId, type: edgeType, animated: true })
      })
    })

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
}, [reactFlowComponents]);


  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
      ),
    []
  );
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  // on nodeClick we will want to set the state of the node info
  const onNodeClick = (_, element) => {
    // console.log('yoyoyoyoyoy');
    // let routes = '';
    // reactFlowComponents[element.id].ajaxRequests.forEach(route => routes += `\nMethod: ${route.method}\nRoute: ${route.route}\nFull Route: ${route.fullRoute}`);
    // console.log(reactFlowComponents);
    // alert(`Clicked on node: ${element.id}\nROUTES: ${routes ? routes : 'none'}`);
    const compName = getComponentName(element.id);
    setComponentName(compName);
    setNodeInfo(reactFlowComponents[element.id].ajaxRequests);
  };

  const getComponentName = (string) => {
    const splitString = string.split('/');
    return splitString[splitString.length - 1];
  }


  return (
    <div>
      <ReactFlow
        id="tree"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        onNodeClick={onNodeClick}
      >
        <Panel position="bottom-left">
          <div id="button-section" className="flex">
            <button className="btn m-1" onClick={() => onLayout('TB')}>
              <img className="h-8 " src={vertical} alt='vertical layout  button'/>
            </button>
            <button className="btn m-1" onClick={() => onLayout('LR')} >
              <img className="h-8" src={horizontal} alt='horizontal layout button'/>
            </button>
          </div>
        </Panel>
      </ReactFlow>
      <Details componentName={componentName} nodeInfo={nodeInfo}/>
    </div>
  );
};

export default Tree;

