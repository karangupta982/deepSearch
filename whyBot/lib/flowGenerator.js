import { v4 as uuidv4 } from 'uuid';
import { generateQAFlow } from './GroqClient';

// Function to add an initial question and its answer to the flow
export function initializeFlow(question) {
  const questionId = uuidv4();
  const answerId = uuidv4();

  const questionNode = {
    id: questionId,
    type: 'question',
    content: question
  };

  const answerNode = {
    id: answerId,
    type: 'answer',
    content: 'Loading answer...',
    parentId: questionId
  };

  const thread = {
    id: uuidv4(),
    sourceId: questionId,
    targetId: answerId
  };

  return {
    nodes: [questionNode, answerNode],
    threads: [thread]
  };
}

// Function to update a node's content
export function updateNodeContent(flow, nodeId, content) {
  return {
    ...flow,
    nodes: flow.nodes.map(node =>
      node.id === nodeId ? { ...node, content } : node
    )
  };
}

// Function to add follow-up questions to the flow
export function addFollowUpQuestions(flow, parentAnswerId, questions) {
  const newNodes = [];
  const newThreads = [];

  questions.forEach(question => {
    const questionId = uuidv4();

    newNodes.push({
      id: questionId,
      type: 'question',
      content: question,
      parentId: parentAnswerId
    });

    newThreads.push({
      id: uuidv4(),
      sourceId: parentAnswerId,
      targetId: questionId
    });
  });

  return {
    nodes: [...flow.nodes, ...newNodes],
    threads: [...flow.threads, ...newThreads]
  };
}

// Function to expand the flow with a selected follow-up question
export async function expandFlow(flow, questionId) {
  const questionNode = flow.nodes.find(node => node.id === questionId);

  if (!questionNode || questionNode.type !== 'question') {
    return flow;
  }

  const existingAnswer = flow.nodes.find(
    node => node.type === 'answer' && node.parentId === questionId
  );

  if (existingAnswer) {
    return flow;
  }

  const answerId = uuidv4();
  const answerNode = {
    id: answerId,
    type: 'answer',
    content: 'Loading answer...',
    parentId: questionId
  };

  const thread = {
    id: uuidv4(),
    sourceId: questionId,
    targetId: answerId
  };

  let updatedFlow = {
    nodes: [...flow.nodes, answerNode],
    threads: [...flow.threads, thread]
  };

  try {
    const response = await generateQAFlow(questionNode.content);
    updatedFlow = updateNodeContent(updatedFlow, answerId, response.answer);
    updatedFlow = addFollowUpQuestions(updatedFlow, answerId, response.followUpQuestions);
  } catch (error) {
    console.error('Error expanding flow:', error);
    updatedFlow = updateNodeContent(
      updatedFlow,
      answerId,
      'Sorry, I encountered an error generating this answer. Please try again.'
    );
  }

  return updatedFlow;
}

// Function to delete a thread and all its downstream nodes and threads
export function deleteThread(flow, threadId) {
  const threadToDelete = flow.threads.find(thread => thread.id === threadId);

  if (!threadToDelete) {
    return flow;
  }

  const nodesToRemove = new Set([threadToDelete.targetId]);
  const threadsToRemove = new Set([threadId]);

  const findDownstream = (nodeId) => {
    flow.threads
      .filter(thread => thread.sourceId === nodeId)
      .forEach(thread => {
        threadsToRemove.add(thread.id);
        nodesToRemove.add(thread.targetId);
        findDownstream(thread.targetId);
      });
  };

  findDownstream(threadToDelete.targetId);

  return {
    nodes: flow.nodes.filter(node => !nodesToRemove.has(node.id)),
    threads: flow.threads.filter(thread => !threadsToRemove.has(thread.id))
  };
}