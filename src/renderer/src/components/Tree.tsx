import { useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  useReactFlow
} from 'reactflow';

// import dagre from 'dagre';
import ELK from 'elkjs';
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
import { RootState, Component } from '../interfaces/stateInterfaces';

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

const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.['elk.direction'] !== 'RIGHT';
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',

      // Hardcode a width and height for elk to use when layouting.
      width: 500,
      height: 200,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children?.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};


// setting the types for different components
type Node = {
  id: string;
  data: { label: string, active: boolean };
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
  const { fitView } = useReactFlow();

  const reactFlowComponents = useSelector((state: RootState) => state.project.components);
  const active = useSelector((state: RootState) => state.detail.active);
  const dispatch = useDispatch();

  //components that are re-used are given unique id's by adding a number to the end of the absolute file path (AFP). this function converts that id back to the AFP (i.e. as it appears in reactFlowComponents), then returns the object associated with this AFP key in reactFlowComponents.
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
      (obj: Component) => !listOfChildIds.has(obj.id)
    );

    if (roots.length) roots.forEach((root) => gatherChildren(root)); //iterate thru each root and gather it's children


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

    const newNodeIDs = newNodes.map(node => node.id.slice(0,-1));

    //for each node, for each of its children, create a connection (edge) between that node and one of the nodes that represents the child. Pick the child node whose id ends with the value of the child node in the 'childCount' object. Then decrement this value in 'childCount' so that no child has multiple parents.
    newNodes.forEach((obj) => {
      const component = getComponentFromNodeId(obj.id);
      component.children.forEach((childId) => {
        if (!newNodeIDs.includes(childId)) return;
        let child = childCount[childId] || 1;
        console.log('objid', childId, child)
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

    getLayoutedElements(newNodes, newEdges).then((result) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = result as { nodes: Node[], edges: Edge[] }
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);

      window.requestAnimationFrame(() => fitView());

    })

  }, [reactFlowComponents]);

  const onConnect = useCallback(
    (params) =>
      setEdges(
        (
          eds //eds is previous value of the edge's variable
        ) =>
          addEdge(
            params,
            eds
          )
      ),
    []
  );
  const onLayout = useCallback(
    (direction) => {
      const opts = { 'elk.direction': direction, ...elkOptions };
      getLayoutedElements(nodes, edges, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
        window.requestAnimationFrame(() => fitView());
      })
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
    dispatch(setActiveComponentCode(componentCode.data));
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
            onClick={() => onLayout({direction: 'DOWN'})}
          >
            <img className='h-4 m-1' src={vertical} alt='vertical layout button' />
          </button>
          <button
            className='btn ml-1 bg-white rounded-full'
            onClick={() => onLayout({direction: 'RIGHT'})}
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

export default () =>(
  <ReactFlowProvider>
    <Tree />
  </ReactFlowProvider>
);