export interface Node {
    id: string;
    type: 'question' | 'answer';
    content: string;
    position?: {
      x: number;
      y: number;
    };
  }
  
  export interface Edge {
    id: string;
    source: string;
    target: string;
  }
  
  export interface GraphData {
    nodes: Node[];
    edges: Edge[];
  }
  
  export interface GroqResponse {
    role: string;
    content: string;
  }