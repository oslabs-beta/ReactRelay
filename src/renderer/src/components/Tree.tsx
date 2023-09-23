import { useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
} from 'reactflow';

import dagre from 'dagre';
import horizontal from '../assets/images/left-right-solid.svg';
import vertical from '../assets/images/up-down-solid.svg';
import CustomNode from './custom-nodes/custom-node';
import CustomNode2 from './custom-nodes/custom-node2';
import '../assets/index.css';
import 'reactflow/dist/style.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  setNodeInfo,
  setComponentName,
} from '../features/projectSlice';
import { setTreeContainerClick,
  setActive,
  setActiveComponentCode } from '../features/detailSlice';
// import { Window } from '../interfaces/Interfaces';

const nodeTypes = {
  CustomNode,
  CustomNode2,
};


const edgeType = 'smoothstep';
// declaring both edge styles which we will be using
// these use svg styling in case one wants to update them.
// you can look up options here: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
const edgeStyle = {
  stroke: 'black',
  'strokeWidth': 4,
};
const edgeStyle2 = {
  stroke: 'red',
  'strokeWidth': 8,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// controls spacing between nodes
const nodeWidth = 300;
const nodeHeight = 50;

// All you have to do to change the default layout is change 'LR' to 'TB' or 'RL'
const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
    edge.animated = true;
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
  ajaxRequests: AjaxRequest[];
};

type AjaxRequest = {
  route: string;
  fullRoute: string;
  method: string;
};

type Node = {
  id: string;
  data: any;
  position: { x: number; y: number };
  type: string;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
  className: string;
  style: object;
};

function Tree({}): JSX.Element {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowComponents = useSelector((state: any) => state.project.components);
  const active = useSelector((state: any) => state.detail.active);
  const dispatch = useDispatch();
  //components that are re-used are given unique id's by adding a number to the end of the AFP. this function converts that id back to the AFP (i.e. as it appears in reactFlowComponents), then return the object associated with this AFP key in reactFlowComponents.
  const getComponentFromNodeId = (id: string): Component => {
    let i = id.length - 1;
    while (/[0-9]/.test(id[i]) && i > 10) i--;
    return reactFlowComponents[id.slice(0, i + 1)];
  };

  const handleTreeContainerClick = (e) => {
    if (!e.target.closest('.react-flow__node')) {
      dispatch(setTreeContainerClick());
    }
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
            data: { ...obj.data, active: false },
            position: { x: 0, y: 0 },
            type: obj.ajaxRequests.length ? 'CustomNode' : 'CustomNode2',
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
          className: 'edgeClass',
          // setting the default edge style to be the modified one to make
          // the edges more visible when zoomed out.
          style: edgeStyle,
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
      setEdges(
        (
          eds //eds is previous value of the edge's variable
        ) =>
          addEdge(
            { ...params, type: ConnectionLineType.SmoothStep, animated: true },
            eds
          )
      ),
    []
  );
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  // on nodeClick we will want to set the state of the node info
  const onNodeClick = async (_, element) => {
    const component = getComponentFromNodeId(element.id);
    const compName = getComponentName(element.id);
    dispatch(setComponentName(compName));
    dispatch(setNodeInfo(reactFlowComponents[component.id].ajaxRequests));
    const updatedNodes = nodes.map((node) => {
      // console.log(active);
      return node.id === element.id
        ? { ...node, data: { ...node.data, active: true } }
        : node.id === active
        ? { ...node, data: { ...node.data, active: false } }
        : node;
    });
    dispatch(setActive(element.id));
    const encodedId = encodeURIComponent(component.id);
    const componentCode = await window.api.send('code', { id: encodedId });
    // console.log(componentCode, 'componentCode');
    // console.log('data', data)
    dispatch(setActiveComponentCode(componentCode));
    // when clicked, the active node's edges will be highlighted in red,
    // otherwise they will go back to the default black color.
    // the edge.source and edge.target are both selected here to highlight
    // the connection line on both ends of the node.
    const updatedEdges = edges.map((edge) => {
      return edge.source === element.id || edge.target === element.id
        ? { ...edge, style: edgeStyle2 }
        : edge.source === active || edge.target === active
        ? { ...edge, style: edgeStyle }
        : edge;
    });
    setNodes(updatedNodes);
    setEdges(updatedEdges);
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
    <ReactFlow
      id='tree'
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      nodesDraggable={true}
      fitView={true}
      fitViewOptions={{ padding: 1 }}
      minZoom={0.1}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      onClick={(e) => handleTreeContainerClick(e)}
    >
      <Panel position='top-left'>
        <div id='button-section' className='flex'>
          <button
            className='btn bg-white rounded-full'
            onClick={() => onLayout('TB')}
          >
            <img className='h-4 m-1' src={vertical} alt='vertical layout button' />
          </button>
          <button
            className='btn ml-1 bg-white rounded-full'
            onClick={() => onLayout('LR')}
          >
            <img
              className='h-4'
              src={horizontal}
              alt='horizontal layout button'
            />
          </button>
        </div>
      </Panel>
      <Controls position='top-right' />
      <MiniMap pannable={true} zoomable={true} className='mini-map max' />
    </ReactFlow>
  );
}

export default Tree;
