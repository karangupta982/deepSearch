import { v4 as uuidv4 } from 'uuid';
import { generateAnswer } from '../services/api';

// Initialize a flow with a root question
export function initializeFlow(question) {
  const questionId = uuidv4();
  
  return {
    nodes: [
      {
        id: questionId,
        type: 'question',
        content: question,
        position: { x: 250, y: 0 },
        parentId: null,
      }
    ],
    edges: []
  };
}

// Expand the flow with an answer and follow-up questions
export async function expandFlow(flow, questionNodeId) {
  // Find the question node
  const questionNode = flow.nodes.find(node => node.id === questionNodeId);
  if (!questionNode) throw new Error('Question node not found');
  
  try {
    // Generate answer and follow-up questions
    console.log(`Generating answer for: "${questionNode.content}"`);
    const { answer, followUpQuestions } = await generateAnswer(questionNode.content);
    
    // Create answer node
    const answerId = uuidv4();
    const answerNode = {
      id: answerId,
      type: 'answer',
      content: answer,
      position: { x: questionNode.position.x, y: questionNode.position.y + 150 },
      parentId: questionNodeId,
    };
    
    // Create edge from question to answer
    const questionToAnswerEdge = {
      id: `${questionNodeId}-${answerId}`,
      source: questionNodeId,
      target: answerId,
    };
    
    // Create follow-up question nodes and edges
    const followUpNodes = [];
    const followUpEdges = [];
    
    followUpQuestions.forEach((question, index) => {
      const followUpId = uuidv4();
      
      // Position follow-up questions in a row below the answer
      const xOffset = (index - (followUpQuestions.length - 1) / 2) * 300;
      
      followUpNodes.push({
        id: followUpId,
        type: 'question',
        content: question,
        position: { x: questionNode.position.x + xOffset, y: questionNode.position.y + 300 },
        parentId: answerId,
      });
      
      followUpEdges.push({
        id: `${answerId}-${followUpId}`,
        source: answerId,
        target: followUpId,
      });
    });
    
    // Update the flow
    return {
      nodes: [...flow.nodes, answerNode, ...followUpNodes],
      edges: [...flow.edges, questionToAnswerEdge, ...followUpEdges],
    };
  } catch (error) {
    console.error('Error in expandFlow:', error);
    throw new Error(`Failed to expand question: ${error.message}`);
  }
}