import { useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import dagre from 'dagre';

// import { initialNodes, initialEdges } from '../nodes-edges.js';

import 'reactflow/dist/style.css';
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

function Tree(): JSX.Element {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    console.log('aaaaaaaaaaa')
    const fetchComponents = async () => {

      try {
        const res = await fetch('http://localhost:3000/components');
        console.log(res.ok, 'res.ok', res)
        const components = await res.json();
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];

        (Object.values(components) as Component[]).forEach((obj: Component) => {
          newNodes.push({ id: obj.id, data: obj.data, position: { x: 0, y: 0 } })
          obj.children.forEach(childId => {
            newEdges.push({ id: (obj.id).concat(childId), source: obj.id, target: childId, type: edgeType, animated: true })
          })
        })
        console.log('newNodes', newNodes)
        console.log('newEdges', newEdges);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          newNodes,
          newEdges
        );
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      } catch(err) {
        console.error('ERROR:' + err)
      }
    }
    fetchComponents();
  }, [])

  console.log(nodes, edges, 'zzzzzz')

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

  const onNodeClick = (_, element) => {
    console.log('yoyoyoyoyoy');
    alert(`Clicked on node: ${element.id}`);
  };

  return (
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
        <Panel position="top-right">
          <button onClick={() => onLayout('TB')}>vertical layout</button>
          <button onClick={() => onLayout('LR')}>horizontal layout</button>
        </Panel>
      </ReactFlow>
  );
};

export default Tree;

