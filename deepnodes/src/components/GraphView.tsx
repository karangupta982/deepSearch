
"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  ReactFlowProvider,
  Edge as ReactFlowEdge,
  Node as ReactFlowNode
} from 'reactflow';
import 'reactflow/dist/style.css';
import { fetchGroqResponse } from '@/lib/groq';
import { Node, Edge, GraphData } from '@/types';
import CustomNode from './Node';

// Register the custom node
const nodeTypes = {
  customNode: CustomNode,
};

interface GraphViewProps {
  initialPrompt: string;
}

export default function GraphView({ initialPrompt }: GraphViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: []
  });
  
  // For the follow-up question input
  const [question, setQuestion] = useState('');
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchInitialResponse() {
      if (!initialPrompt) return;
      
      setLoading(true);
      try {
        const response = await fetchGroqResponse(initialPrompt);
        
        // Create initial graph data
        const questionNode: Node = {
          id: 'q-initial',
          type: 'question',
          content: initialPrompt,
          position: { x: 250, y: 50 }
        };
        
        const answerNode: Node = {
          id: 'a-initial',
          type: 'answer',
          content: response.content,
          position: { x: 250, y: 150 }
        };
        
        const edge: Edge = {
          id: 'e-initial',
          source: 'q-initial',
          target: 'a-initial'
        };
        
        setGraphData({
          nodes: [questionNode, answerNode],
          edges: [edge]
        });
      } catch (err) {
        console.error('Error fetching initial response:', err);
        setError('Failed to fetch response from AI. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchInitialResponse();
  }, [initialPrompt]);
  
  const handleNodeClick = (nodeId: string) => {
    setCurrentFocus(nodeId);
  };
  
  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const newQuestionId = `q-${Date.now()}`;
      
      // Find current selected node or use the last answer node
      const sourceNodeId = currentFocus || 
        [...graphData.nodes].reverse().find(n => n.type === 'answer')?.id || 
        'a-initial';
      
      const response = await fetchGroqResponse(question);
      
      const newAnswerId = `a-${Date.now()}`;
      
      // Create new nodes
      const newQuestionNode: Node = {
        id: newQuestionId,
        type: 'question',
        content: question,
        // Position based on the source node with offset
        position: { 
          x: (graphData.nodes.find(n => n.id === sourceNodeId)?.position?.x || 250) + 100,
          y: (graphData.nodes.find(n => n.id === sourceNodeId)?.position?.y || 150) + 100
        }
      };
      
      const newAnswerNode: Node = {
        id: newAnswerId,
        type: 'answer',
        content: response.content,
        position: {
          x: newQuestionNode.position!.x + 100,
          y: newQuestionNode.position!.y + 100
        }
      };
      
      // Create edges
      const sourceToQuestionEdge: Edge = {
        id: `e-${sourceNodeId}-${newQuestionId}`,
        source: sourceNodeId,
        target: newQuestionId
      };
      
      const questionToAnswerEdge: Edge = {
        id: `e-${newQuestionId}-${newAnswerId}`,
        source: newQuestionId,
        target: newAnswerId
      };
      
      // Update graph data
      setGraphData(prev => ({
        nodes: [...prev.nodes, newQuestionNode, newAnswerNode],
        edges: [...prev.edges, sourceToQuestionEdge, questionToAnswerEdge]
      }));
      
      setQuestion('');
      setCurrentFocus(newAnswerId);
    } catch (err) {
      console.error('Error asking follow-up question:', err);
      setError('Failed to fetch response. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Convert to ReactFlow format
  const reactFlowNodes: ReactFlowNode[] = graphData.nodes.map(node => ({
    id: node.id,
    type: 'customNode',
    position: node.position || { x: 0, y: 0 },
    data: { 
      node,
      onClick: () => handleNodeClick(node.id),
      isHighlighted: node.id === currentFocus
    }
  }));
  
  const reactFlowEdges: ReactFlowEdge[] = graphData.edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#555' }
  }));

  if (loading && reactFlowNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your answer...</p>
        </div>
      </div>
    );
  }

  if (error && reactFlowNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
        <div className="text-center p-6 bg-gray-700 rounded-lg max-w-md">
          <div className="text-red-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => window.location.href = '/'}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-800">
      <ReactFlowProvider>
        <div className="h-full">
          <ReactFlow
            nodes={reactFlowNodes}
            edges={reactFlowEdges}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#444" gap={16} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                return node.data.node.type === 'question' ? '#3b82f6' : '#374151';
              }}
            />
          </ReactFlow>
        </div>
        
        {/* Floating input for follow-up questions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="w-full p-4 pr-12 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAskQuestion();
                }
              }}
              disabled={loading}
            />
            <button 
              onClick={handleAskQuestion}
              disabled={loading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
}