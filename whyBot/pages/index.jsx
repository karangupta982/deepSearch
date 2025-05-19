import { useState } from 'react';
import Head from 'next/head';
import QuestionInput from '../components/QuestionInput';
import FlowVisualization from '../components/FlowVisualization';
import LoadingSpinner from '../components/LoadingSpinner';
import { initializeFlow, expandFlow } from '../utils/flowGenerator';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [flow, setFlow] = useState({ nodes: [], edges: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle question submission
  const   handleSubmitQuestion = async (question) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Processing question:', question);
      
      // Initialize flow with the question
      const newFlow = initializeFlow(question);
      setFlow(newFlow);
      
      // Find the question node
      const questionNode = newFlow.nodes.find(node => node.type === 'question' && !node.parentId);
      if (!questionNode) throw new Error('Question node not found');
      
      // Expand flow with answer and follow-up questions
      console.log('Expanding flow for question:', questionNode.content);
      const expandedFlow = await expandFlow(newFlow, questionNode.id);
      setFlow(expandedFlow);
    } catch (err) {
      console.error('Error submitting question:', err);
      setError('Failed to process your question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle node click to expand follow-up questions
  const handleNodeClick = async (nodeId) => {
    // Only expand question nodes that don't have answers yet
    const node = flow.nodes.find(n => n.id === nodeId);
    if (!node || node.type !== 'question') return;
    
    // Check if this question already has an answer
    const hasAnswer = flow.nodes.some(n => n.parentId === nodeId);
    if (hasAnswer) return;
    
    setIsLoading(true);
    try {
      const expandedFlow = await expandFlow(flow, nodeId);
      setFlow(expandedFlow);
    } catch (err) {
      console.error('Error expanding question:', err);
      setError('Failed to expand this question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deletion of connections (edges and related nodes)
  const handleDeleteConnection = (edgeId, sourceId, targetId) => {
    // Find all nodes and edges that should be removed
    const nodesToRemove = new Set();
    const edgesToRemove = new Set([edgeId]);
    
    // Add the target node to the removal list
    nodesToRemove.add(targetId);
    
    // Recursively find all child nodes and edges
    const findChildrenRecursively = (parentId) => {
      // Find direct children
      const childNodes = flow.nodes.filter(node => node.parentId === parentId);
      
      // Add each child to the removal list and find its children
      childNodes.forEach(child => {
        nodesToRemove.add(child.id);
        
        // Find and add edges connected to this child
        flow.edges.forEach(edge => {
          if (edge.source === child.id || edge.target === child.id) {
            edgesToRemove.add(edge.id);
          }
        });
        
        // Recursively find children of this child
        findChildrenRecursively(child.id);
      });
    };
    
    // Start the recursive search from the target node
    findChildrenRecursively(targetId);
    
    // Filter out the nodes and edges to be removed
    const updatedNodes = flow.nodes.filter(node => !nodesToRemove.has(node.id));
    const updatedEdges = flow.edges.filter(edge => !edgesToRemove.has(edge.id));
    
    // Update the flow
    setFlow({
      nodes: updatedNodes,
      edges: updatedEdges
    });
  };

  // Generate a random question
  const handleRandomQuestion = () => {
    const randomQuestions = [
      "Why is the sky blue?",
      "Why do we dream?",
      "Why do leaves change color in autumn?",
      "Why do we get hiccups?",
      "Why are flamingos pink?",
      "Why do we have fingerprints?",
      "Why do cats purr?",
      "Why do we need sleep?",
    ];
    
    const randomIndex = Math.floor(Math.random() * randomQuestions.length);
    handleSubmitQuestion(randomQuestions[randomIndex]);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>WhyBot - Explore Questions</title>
        <meta name="description" content="Explore questions and their answers with WhyBot" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>WhyBot</h1>
        
        <QuestionInput 
          onSubmitQuestion={handleSubmitQuestion} 
          onRandomQuestion={handleRandomQuestion} 
        />
        
        {isLoading && <LoadingSpinner />}
        
        {error && <div className={styles.error}>{error}</div>}
        
        {flow.nodes.length > 0 && !isLoading && (
          <div className={styles.flowSection}>
            <h2>Exploration Flow</h2>
            <p>Click on any question node to expand it with an answer and follow-up questions. Hover over connections to delete threads.</p>
            <FlowVisualization 
              flow={flow} 
              onNodeClick={handleNodeClick} 
              onDeleteConnection={handleDeleteConnection}
            />
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>WhyBot - Explore the why behind everything</p>
      </footer>
    </div>
  );
}