import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  // this is where you import the Controls and MiniMap components from ReactFlow
  Controls,
  MiniMap,
} from 'reactflow';
import dagre from 'dagre';
import horizontal from '../assets/images/flowchart-horizontal.png';
import vertical from '../assets/images/flowchart-vertical.png';

// importing the custom node
import CustomNode from './custom-nodes/custom-node';
// importing the custom node
import CustomNode2 from './custom-nodes/custom-node2';

const nodeTypes = {
  CustomNode,
  CustomNode2,
};
// importing the default ReactFlow styles
import 'reactflow/dist/style.css';
// importing the Details component
import Details from './Details';
// import { get } from 'mongoose';

// const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';

// const initialNodes = [];
// const initialEdges = [];

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// controls spacing between nodes
const nodeWidth = 100;
const nodeHeight = 34;

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

// setting the types for different components

type Component = {
  id: string;
  data: any;
  children: string[];
  ajaxRequests: string[];
};

type Node = {
  id: string;
  data: any;
  position: { x: number; y: number };
  type: string;
  ajaxRequests: string[];
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
  const [componentName, setComponentName] = useState('');

  //components that are re-used are given unique id's by adding a number to the end of the AFP. this function converts that id back to the AFP (i.e. as it appears in reactFlowComponents), then return the object associated with this AFP key in reactFlowComponents.
  const getComponentFromNodeId = (id: string): Component => {
    let i = id.length - 1;
    while (/[0-9]/.test(id[i]) && i > 10) i--;
    return reactFlowComponents[id.slice(0, i + 1)];
  };

  useEffect(() => {
    if (!reactFlowComponents) return;
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const childCount = {};
    const listOfChildIds = new Set();

    //create a Set containing all components that are children of other components (used to isolate 'roots' array below)
    (Object.values(reactFlowComponents) as Component[]).forEach(
      (obj: Component) => {
        obj.children.forEach((childId) => listOfChildIds.add(childId));
      }
    );

    //recursive func that increments the value of component id in "childCount" array by 1 for each instance of that child, then invokes gatherChildren passing in the obj in reactFlowComponents that represents that child component
    const gatherChildren = (root: Component, ripCord: string[] = []): void => {
      // console.log('component', root)
      root.children.forEach((childId) => {
        if (
          Object.hasOwn(reactFlowComponents, childId) &&
          !ripCord.includes(childId)
        ) {
          // Used to prevent infinite loop of when a child may create its
          // parent conditionally. If that occurs, the recursive function ends.
          childCount[childId]
            ? childCount[childId]++
            : (childCount[childId] = 1);
          ripCord.push(childId);
          gatherChildren(reactFlowComponents[childId], ripCord);
          ripCord.pop();
        }
      });
    };

    //filter for components that have no parent, then invoke 'gatherChildren' on each of them
    // console.log('list of children and their id ---> ', listOfChildIds);
    const roots = Object.values(reactFlowComponents).filter(
      (obj: any): obj is Component => !listOfChildIds.has(obj.id)
    );
    // console.log('ROOTS ----> ', roots);
    if (roots.length) roots.forEach((root) => gatherChildren(root)); //iterate thru each root and gather it's children

    // console.log(childCount, '<---- childCount');

    //iterate through all components in reactFlowComponents. Whatever the value of that componentId is in childCount, create that many new nodes for this component. (create just 1 node if it doesn't appear in childCount);
    (Object.values(reactFlowComponents) as Component[]).forEach(
      (obj: Component) => {
        // obj.ajaxRequests --> check if this is empty or has values
        // to change the node's styling using custom nodes
        let i = childCount[obj.id] || 1;
        // adds the number of components which are present, as there could be multiple copies 
        //TODO: determine whether or not we need multiple copies.
        // takes care of a component that is used in more than just 1 component
        while (i >= 1) {
          newNodes.push({
            id: obj.id + i,
            data: obj.data,
            position: { x: 0, y: 0 },
            type: obj.ajaxRequests.length ? 'CustomNode' : 'CustomNode2',
            ajaxRequests: obj.ajaxRequests,
          });
          i--;
        }
      }
    );

    //for each node, for each of its children, create a connection (edge) between that node and one of the nodes that represents the child. Pick the child node whose id ends with the value of the child node in the 'childCount' object. Then decrement this value in 'childCount' so that no child has multiple parents.
    newNodes.forEach((obj) => {
      const component = getComponentFromNodeId(obj.id);
      component.children.forEach((childId) => {
        let child = childCount[childId] || 1;
        newEdges.push({
          id: obj.id.concat(childId + child),
          source: obj.id,
          target: childId + child,
          type: edgeType,
          animated: true,
        });
        childCount[childId]--;
      });
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
      setEdges((eds) => //eds is previous value of the edge's variable
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    []
  );
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  // on nodeClick we will want to set the state of the node info
  const onNodeClick = (_, element) => {
    const component = getComponentFromNodeId(element.id);
    const compName = getComponentName(element.id);
    setComponentName(compName);
    setNodeInfo(reactFlowComponents[component.id].ajaxRequests);
  };

  // TODO: REFACTOR THIS
  const getComponentName = (string) => {
    const splitString = string.split('/'); // splitting the file path by / characters
    const componentExtension = splitString[splitString.length - 1]; // getting the final file of the directory
    const splitFileType = componentExtension.split('.'); // splitting the file path from its file extension
    splitFileType[splitFileType.length - 1] = splitFileType[ 
      // selecting whatever comes as the final extension
      // replace any numbers in the file extension with an empty string
      splitFileType.length - 1
    ].replaceAll(/[0-9]/g, '');
    return splitFileType.join('.'); // re-join the file extension with a '.' to properly re-form it
  };

  //TODO: add fragment so that you can return without a div
  return (
    <>
      <ReactFlow
        id='tree'
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView={true}
        minZoom ={0.1}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
      >
        <Panel position='bottom-left'>
          <div id='button-section' className='flex ml-9'>
            <button className='btn m-1 bg-white' onClick={() => onLayout('TB')}>
              <img
                className='h-8 '
                src={vertical}
                alt='vertical layout button'
              />
            </button>
            <button className='btn m-1 bg-white' onClick={() => onLayout('LR')}>
              <img
                className='h-8'
                src={horizontal}
                alt='horizontal layout button'
              />
            </button>
          </div>
        </Panel>
        <Controls />
        <MiniMap pannable='true' zoomable='true' className='mini-map max' />
      </ReactFlow>
      {componentName !== '' && 
      <Details componentName={componentName} nodeInfo={nodeInfo} />}
    </>
  );
}

export default Tree;
