// import React, { useState, useCallback } from 'react';
// import ReactFlow, { 
//   Background, 
//   Controls, 
//   MiniMap,
//   Handle,
//   Position,
//   useNodesState,
//   useEdgesState
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import styles from '../styles/Flow.module.css';

// // Custom Question Node
// const QuestionNode = ({ data }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const maxHeight = 100;
//   const contentRef = React.useRef(null);
//   const [showViewMore, setShowViewMore] = useState(false);

//   React.useEffect(() => {
//     if (contentRef.current) {
//       setShowViewMore(contentRef.current.scrollHeight > maxHeight);
//     }
//   }, [data.content]);

//   const handleViewMore = (e) => {
//     e.stopPropagation(); // Prevent event from bubbling up
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <div className={styles.questionNode}>
//       <Handle type="target" position={Position.Top} />
//       <div 
//         ref={contentRef}
//         className={`${styles.nodeContent} ${!isExpanded ? styles.collapsed : ''}`}
//       >
//         {data.content}
//       </div>
//       {showViewMore && (
//         <button 
//           className={styles.viewMoreButton}
//           onClick={handleViewMore}
//         >
//           {isExpanded ? 'View less' : 'View more'}
//         </button>
//       )}
//       <Handle type="source" position={Position.Bottom} />
//       <div className={styles.nodeControls}>
//         <button 
//           className={styles.controlButton} 
//           title="Expand" 
//           onClick={(e) => {
//             e.stopPropagation();
//             data.onExpand();
//           }}
//         >
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// // Custom Answer Node
// const AnswerNode = ({ data }) => {
//   return (
//     <div className={styles.answerNode}>
//       <Handle type="target" position={Position.Top} />
//       <div className={styles.nodeContent}>{data.content}</div>
//       <Handle type="source" position={Position.Bottom} />
//     </div>
//   );
// };

// // Custom Edge with Delete Button
// const CustomEdge = ({ id, source, target, style = {}, data, ...props }) => {
//   const [showDelete, setShowDelete] = useState(false);
  
//   return (
//     <>
//       <path
//         id={id}
//         className={styles.edgePath}
//         d={`M${props.sourceX},${props.sourceY} C ${props.sourceX},${props.sourceY + 50} ${props.targetX},${props.targetY - 50} ${props.targetX},${props.targetY}`}
//         strokeWidth={2}
//         stroke="#94a3b8"
//         fill="none"
//         onMouseEnter={() => setShowDelete(true)}
//         onMouseLeave={() => setShowDelete(false)}
//       />
      
//       {showDelete && (
//         <foreignObject
//           width={28}
//           height={28}
//           x={(props.sourceX + props.targetX) / 2 - 14}
//           y={(props.sourceY + props.targetY) / 2 - 14}
//           className={styles.edgeButtonForeignObject}
//           onMouseEnter={() => setShowDelete(true)}
//           onMouseLeave={() => setShowDelete(false)}
//           onClick={() => data.onDelete(id, source, target)}
//         >
//           <div className={styles.edgeButton}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M6 9L12 15M12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M14 6L18 10M18 6L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//         </foreignObject>
//       )}
//     </>
//   );
// };

// // Node types mapping
// const nodeTypes = {
//   question: QuestionNode,
//   answer: AnswerNode,
// };

// // Edge types mapping
// const edgeTypes = {
//   custom: CustomEdge,
// };

// export default function FlowVisualization({ flow, onNodeClick, onDeleteConnection }) {
//   // Transform flow data for ReactFlow with proper vertical spacing
//   const nodes = flow.nodes.map(node => {
//     // Find parent node to calculate vertical position
//     const parentNode = flow.nodes.find(n => n.id === node.parentId);
//     let yPosition = node.position.y;

//     // If node has a parent, position it at least 100px below
//     if (parentNode) {
//       yPosition = parentNode.position.y + 100;
//     }

//     return {
//       id: node.id,
//       type: node.type,
//       position: { 
//         x: node.position.x,
//         y: yPosition
//       },
//       draggable: true, // Enable individual node dragging
//       data: { 
//         content: node.content, 
//         parentId: node.parentId,
//         onExpand: () => onNodeClick(node.id)
//       },
//     };
//   });

//   // Transform edges and add custom type
//   const edges = flow.edges.map(edge => ({
//     ...edge,
//     type: 'custom',
//     data: {
//       onDelete: onDeleteConnection
//     }
//   }));

//   const onInit = useCallback((reactFlowInstance) => {
//     reactFlowInstance.fitView({ padding: 0.2 });
//   }, []);

//   return (
//     <div className={styles.flowContainer}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         nodeTypes={nodeTypes}
//         edgeTypes={edgeTypes}
//         onNodeClick={(_, node) => onNodeClick(node.id)}
//         onInit={onInit}
//         fitView
//         minZoom={0.5}
//         maxZoom={1.5}
//         defaultZoom={0.8}
//         nodesDraggable={true}
//         nodesConnectable={true}
//         elementsSelectable={true}
//         snapToGrid={true}
//         snapGrid={[20, 20]}
//       >
//         <Background color="#cbd5e1" gap={16} size={1} />
//         <Controls />
//         <MiniMap 
//           nodeColor={(node) => {
//             switch (node.type) {
//               case 'question':
//                 return '#3b82f6';
//               case 'answer':
//                 return '#10b981';
//               default:
//                 return '#d1d5db';
//             }
//           }}
//           maskColor="rgba(248, 250, 252, 0.5)"
//         />
//       </ReactFlow>
//     </div>
//   );
// }












// ---------------------


import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Handle,
  Position,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import styles from '../styles/Flow.module.css';

// Custom Question Node
const QuestionNode = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxHeight = 80; // Shorter initial height to reduce crowding
  const contentRef = React.useRef(null);
  const [showViewMore, setShowViewMore] = useState(false);

  React.useEffect(() => {
    if (contentRef.current) {
      setShowViewMore(contentRef.current.scrollHeight > maxHeight);
    }
  }, [data.content]);

  const handleViewMore = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.questionNode}>
      <Handle type="target" position={Position.Top} />
      <div 
        ref={contentRef}
        className={`${styles.nodeContent} ${!isExpanded ? styles.collapsed : ''}`}
      >
        {data.content}
      </div>
      {showViewMore && (
        <button 
          className={styles.viewMoreButton}
          onClick={handleViewMore}
        >
          {isExpanded ? 'View less' : 'View more'}
        </button>
      )}
      <Handle type="source" position={Position.Bottom} />
      <div className={styles.nodeControls}>
        <button 
          className={styles.controlButton} 
          title="Expand" 
          onClick={(e) => {
            e.stopPropagation();
            data.onExpand();
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Custom Answer Node
const AnswerNode = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxHeight = 80; // Shorter initial height
  const contentRef = React.useRef(null);
  const [showViewMore, setShowViewMore] = useState(false);

  React.useEffect(() => {
    if (contentRef.current) {
      setShowViewMore(contentRef.current.scrollHeight > maxHeight);
    }
  }, [data.content]);

  const handleViewMore = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.answerNode}>
      <Handle type="target" position={Position.Top} />
      <div 
        ref={contentRef}
        className={`${styles.nodeContent} ${!isExpanded ? styles.collapsed : ''}`}
      >
        {data.content}
      </div>
      {showViewMore && (
        <button 
          className={styles.viewMoreButton}
          onClick={handleViewMore}
        >
          {isExpanded ? 'View less' : 'View more'}
        </button>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Custom Edge with Delete Button
const CustomEdge = ({ id, source, target, style = {}, data, ...props }) => {
  const [showDelete, setShowDelete] = useState(false);
  
  return (
    <>
      <path
        id={id}
        className={styles.edgePath}
        d={`M${props.sourceX},${props.sourceY} C ${props.sourceX},${props.sourceY + 50} ${props.targetX},${props.targetY - 50} ${props.targetX},${props.targetY}`}
        strokeWidth={2}
        stroke="#94a3b8"
        fill="none"
        onMouseEnter={() => setShowDelete(true)}
        onMouseLeave={() => setShowDelete(false)}
      />
      
      {showDelete && (
        <foreignObject
          width={28}
          height={28}
          x={(props.sourceX + props.targetX) / 2 - 14}
          y={(props.sourceY + props.targetY) / 2 - 14}
          className={styles.edgeButtonForeignObject}
          onMouseEnter={() => setShowDelete(true)}
          onMouseLeave={() => setShowDelete(false)}
          onClick={() => data.onDelete(id, source, target)}
        >
          <div className={styles.edgeButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15M12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 6L18 10M18 6L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </foreignObject>
      )}
    </>
  );
};

// Node types mapping
const nodeTypes = {
  question: QuestionNode,
  answer: AnswerNode,
};

// Edge types mapping
const edgeTypes = {
  custom: CustomEdge,
};

export default function FlowVisualization({ flow, onNodeClick, onDeleteConnection }) {
  // Initialize nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Calculate and set initial node positions
  React.useEffect(() => {
    // Create a node map for quick lookup
    const nodeMap = {};
    flow.nodes.forEach(node => {
      nodeMap[node.id] = node;
    });
    
    // Create a map of parent to children
    const childrenMap = {};
    flow.nodes.forEach(node => {
      if (node.parentId) {
        if (!childrenMap[node.parentId]) {
          childrenMap[node.parentId] = [];
        }
        childrenMap[node.parentId].push(node.id);
      }
    });
    
    // Constants for spacing
    const HORIZONTAL_SPACING = 300;
    const VERTICAL_SPACING = 150;
    
    // Calculate positions recursively
    const calculatePositions = (nodeId, x = 0, y = 0, visited = {}) => {
      if (visited[nodeId]) return;
      visited[nodeId] = true;
      
      const node = nodeMap[nodeId];
      if (!node) return;
      
      // Set position for this node
      node.position = { x, y };
      
      // Position children
      const children = childrenMap[nodeId] || [];
      let startX = x - ((children.length - 1) * HORIZONTAL_SPACING) / 2;
      
      children.forEach((childId, index) => {
        const childX = startX + index * HORIZONTAL_SPACING;
        calculatePositions(childId, childX, y + VERTICAL_SPACING, visited);
      });
    };
    
    // Find and position root nodes
    const rootNodes = flow.nodes.filter(node => !node.parentId);
    const ROOT_SPACING = 400;
    rootNodes.forEach((node, index) => {
      calculatePositions(node.id, index * ROOT_SPACING, 0, {});
    });
    
    // Create final node objects
    const newNodes = flow.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      draggable: true,
      data: { 
        content: node.content, 
        parentId: node.parentId,
        onExpand: () => onNodeClick(node.id)
      },
    }));

    // Create edges with custom type
    const newEdges = flow.edges.map(edge => ({
      ...edge,
      type: 'custom',
      data: {
        onDelete: onDeleteConnection
      }
    }));

    // Update state
    setNodes(newNodes);
    setEdges(newEdges);
  }, [flow, onNodeClick, onDeleteConnection, setNodes, setEdges]);

  const onInit = useCallback((reactFlowInstance) => {
    reactFlowInstance.fitView({ padding: 0.3 });
  }, []);

  return (
    <div className={styles.flowContainer}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.4}
        maxZoom={1.5}
        defaultZoom={0.7}
        nodesDraggable={true}
        elementsSelectable={true}
      >
        <Background color="#cbd5e1" gap={16} size={1} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'question':
                return '#3b82f6';
              case 'answer':
                return '#10b981';
              default:
                return '#d1d5db';
            }
          }}
          maskColor="rgba(248, 250, 252, 0.5)"
        />
      </ReactFlow>
    </div>
  );
}
