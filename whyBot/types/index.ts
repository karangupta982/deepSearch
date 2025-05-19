// Types for our application
export interface Node {
    id: string;
    type: 'question' | 'answer';
    content: string;
    parentId?: string;
  }
  
  export interface Thread {
    id: string;
    sourceId: string; // ID of the source node
    targetId: string; // ID of the target node
  }
  
  export interface Flow {
    nodes: Node[];
    threads: Thread[];
  }
  
  // Groq API response types
  export interface GroqResponse {
    question: string;
    answer: string;
    followUpQuestions: string[];
  }