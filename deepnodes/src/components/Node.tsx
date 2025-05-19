import React from 'react';
import { Node as NodeType } from '@/types';

interface NodeProps {
  node: NodeType;
  onClick?: () => void;
  isHighlighted?: boolean;
}

export default function Node({ node, onClick, isHighlighted = false }: NodeProps) {
  const maxLength = 150;
  const displayContent = node.content.length > maxLength 
    ? `${node.content.substring(0, maxLength)}...` 
    : node.content;

  return (
    <div 
      className={`
        p-4 rounded-md max-w-md 
        ${node.type === 'question' ? 'border border-blue-500 text-blue-100' : 'bg-gray-700 text-white'}
        ${isHighlighted ? 'ring-2 ring-white' : ''}
        cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-300
      `}
      onClick={onClick}
    >
      {displayContent}
    </div>
  );
}