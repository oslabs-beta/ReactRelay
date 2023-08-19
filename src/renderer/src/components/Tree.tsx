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

  const getComponentFromNodeId = (id: string): Component => {
    let i = id.length-1;
    while (/[0-9]/.test(id[i]) && i > 10) i--;
    return reactFlowComponents[id.slice(0,i+1)];
  }

  useEffect(() => {
    if (!reactFlowComponents) return;
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    const childCount = {};
    const listOfChildIds = new Set();

    (Object.values(reactFlowComponents) as Component[]).forEach((obj: Component) => {
      obj.children.forEach(childId => listOfChildIds.add(childId));
    });


    // (Object.values(reactFlowComponents) as Component[]).forEach((obj: Component) => {
    //   let childrenArray = obj.children;
    //   const childCount = () => {
    //     childrenArray.forEach(childId => {
    //       childCount[childId] ? childCount[childId]++ : childCount[childId] = 1;
    //       temp.push(childId);
    //     })
    //   }
      

    //   obj.children.forEach(childId => {
    //     childCount[childId] ? childCount[childId]++ : childCount[childId] = 1;
    //     while (reactFlowComponents[childId].children) {
    //       reactFlowComponents[childId].children.forEach(grandChild => {
    //         childCount[grandChild] ? childCount[grandChild]++ : childCount[grandChild] = 1;
    //       })
    //     }
    //   })
    // });

    const gatherChildren = (root: Component, ripCord: string[] = []): void => {
      // console.log('component', root)
      root.children.forEach(childId => {
        if (Object.hasOwn(reactFlowComponents, childId) && !ripCord.includes(childId)) {
          childCount[childId] ? childCount[childId]++ : childCount[childId] = 1;
          ripCord.push(childId);
          gatherChildren(reactFlowComponents[childId], ripCord);
        }
      })
    }
    console.log('listttttt', listOfChildIds);
    const roots = Object.values(reactFlowComponents).filter((obj: any): obj is Component => !listOfChildIds.has(obj.id));
    console.log('roots', roots)
    if (roots.length) roots.forEach(root => gatherChildren(root));


    console.log(childCount, 'childCount');

    (Object.values(reactFlowComponents) as Component[]).forEach((obj: Component) => {
      let i = childCount[obj.id] || 1;
      while (i >= 1) {
        newNodes.push({ id: obj.id + i, data: obj.data, position: { x: 0, y: 0 } });
        i--;
      }
    });

    // let sortedChildCount = JSON.parse(JSON.stringify(childCount));
    // let f = 0;
    // while (Object.keys(sortedChildCount).length && f < 100) {
    //   f++;
    //   console.log('f',f)
    //   const sortedKeys = Object.keys(sortedChildCount).sort((a,b) => sortedChildCount[b] - sortedChildCount[a]);
    //   sortedChildCount = sortedKeys.reduce((acc, curr) => {
    //     console.log(acc, curr, 'acc,curr')
    //     acc[curr] = sortedChildCount[curr]
    //     return acc;
    //   }, {})
    //   console.log('sortedChildCount', sortedChildCount)

    //   const firstOne = Object.values(sortedChildCount).indexOf(1);
    //   sortedChildCount = sortedChildCount.slice(0, firstOne);
    //   Object.keys(sortedChildCount).forEach(key => {
    //     reactFlowComponents[key].children.forEach(childId => {
    //       let i = sortedChildCount[key];
    //       let j: any = sortedChildCount[childId];
    //       while (i > 1) {
    //         j++;
    //         newNodes.push({ id: childId + j, data: reactFlowComponents[childId].data, position: { x: 0, y: 0 } });
    //         i--;
    //       }
    //     })
    //   })
    // }

    // const firstOne = Object.values(childCount).indexOf(1);
    // sortedChildCount.slice(0, firstOne).forEach(key => {
    //   if (childCount[key] > 1) {
    //     reactFlowComponents[key]
    //   }
    // })

    //iterate through newNodes instead of RFC?
    newNodes.forEach(obj => {
      const component = getComponentFromNodeId(obj.id);
      component.children.forEach(childId => {
        let child = childCount[childId] || 1;
        newEdges.push({ id: (obj.id).concat(childId + child), source: obj.id, target: childId + child, type: edgeType, animated: true })
        childCount[childId]--;
      })
    });

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
    console.log('element', element)
    const component = getComponentFromNodeId(element.id);
    const compName = getComponentName(element.id);
    setComponentName(compName);
    setNodeInfo(reactFlowComponents[component.id].ajaxRequests);
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
        fitView={true}
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

