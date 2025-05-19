// "use client";

// import { useState, FormEvent, KeyboardEvent } from 'react';
// import { useRouter } from 'next/navigation';

// export default function PromptInput() {
//   const [prompt, setPrompt] = useState('');
//   const router = useRouter();

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     if (prompt.trim()) {
//       // Encode the prompt for URL safety
//       const encodedPrompt = encodeURIComponent(prompt);
//       router.push(`/graph?q=${encodedPrompt}`);
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       handleSubmit(e);
//     }
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto px-4">
//       <div className="text-center mb-8">
//         <h1 className="text-2xl font-medium mb-2">What would you like to understand?</h1>
//       </div>
      
//       <form onSubmit={handleSubmit} className="relative">
//         <input
//           type="text"
//           placeholder="Why..."
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           onKeyDown={handleKeyDown}
//           className="w-full p-4 pr-12 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//         <button 
//           type="submit"
//           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
//           aria-label="Submit prompt"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//           </svg>
//         </button>
//       </form>
      
//       <div className="mt-6">
//         <button 
//           className="flex items-center text-gray-400 hover:text-white"
//           onClick={() => {
//             // Here you would implement the logic to suggest a random question
//             const randomQuestions = [
//               "Can quantum computers reduce the time complexity of a problem?",
//               "Where does runner's high come from?",
//               "Why do we yawn?"
//             ];
//             const randomQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
//             setPrompt(randomQuestion);
//           }}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//           </svg>
//           Suggest random question
//         </button>
//       </div>

//       <div className="mt-16">
//         <h2 className="text-lg font-medium mb-4">Play example runs</h2>
//         <div className="space-y-4">
//           {["Can quantum computers reduce the time complexity of a problem?", 
//             "Where does runner's high come from?", 
//             "Why do we yawn?"].map((question, index) => (
//             <button
//               key={index}
//               className="flex items-center w-full text-left p-3 rounded-md hover:bg-gray-700 transition-colors duration-200"
//               onClick={() => {
//                 const encodedPrompt = encodeURIComponent(question);
//                 router.push(`/graph?q=${encodedPrompt}`);
//               }}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px] mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               {question}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }











'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Play, Lightbulb } from 'lucide-react';

export default function EnhancedSearchComponent() {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      const encodedPrompt = encodeURIComponent(prompt);
      router.push(`/graph?q=${encodedPrompt}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const exampleQuestions = [
    "Can quantum computers reduce the time complexity of a problem?",
    "Where does runner's high come from?",
    "Why do we yawn?"
  ];

  const suggestRandomQuestion = () => {
    const randomQuestion = exampleQuestions[Math.floor(Math.random() * exampleQuestions.length)];
    setPrompt(randomQuestion);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Explore Knowledge Graphs
        </h1>
        <p className="text-gray-400 text-lg">
          Ask a question and visualize connected concepts and explanations
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6  shadow-lg w-[45vw] m-auto border-gray-700">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center mb-[2vh] h-[7vh] rounded-full bg-gray-900 rounded-lg border border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
            <Search className="h-[5vh] w-5 ml-[1vw] mr-[0.5vw] text-gray-400" />
            <input
              type="text"
              placeholder="Ask anything to generate a knowledge graph..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 bg-transparent border-none placeholder-gray-500 focus:outline-none text-lg"
            />
            {prompt && (
              <button 
                type="submit"
                className="px-4 py-2 mr-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center"
              >
                <span className="mr-2">Generate</span>
                <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
        
        <div className="mt-6 flex justify-center">
          <button 
            className="flex items-center text-blue-400  hover:text-blue-300 transition-colors duration-200 text-sm bg-gray-800 border border-gray-700 px-4 py-2 rounded-full"
            onClick={suggestRandomQuestion}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Suggest a random question
          </button>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Popular Examples</h2>
          <div className="ml-3 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-grow"></div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              className="group bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 hover:border-blue-500/30"
              onClick={() => {
                const encodedPrompt = encodeURIComponent(question);
                router.push(`/graph?q=${encodedPrompt}`);
              }}
            >
              <div className="flex items-center mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mr-3">
                  <Play className="h-4 w-4" />
                </div>
                <span className="text-sm text-gray-400">Example</span>
              </div>
              <p className="text-white group-hover:text-blue-300 transition-colors duration-200">
                {question}
              </p>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>Gain deeper insights through interactive knowledge visualization</p>
      </div>
    </div>
  );
}