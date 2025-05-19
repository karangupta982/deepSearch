"use client";

import { useSearchParams } from 'next/navigation';
import GraphView from '@/components/GraphView';
import Link from 'next/link';

export default function GraphPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  if (!query) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
        <div className="text-center p-6 bg-gray-700 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">No query provided</h2>
          <p className="mb-4">Please return to the home page and enter a question.</p>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-800 text-white">
      <div className="absolute top-4 left-4 z-10">
        <Link 
          href="/"
          className="flex items-center text-gray-300 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </Link>
      </div>
      
      <GraphView initialPrompt={query} />
    </main>
  );
}