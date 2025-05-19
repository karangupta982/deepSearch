import React from 'react';
import styles from '../styles/Home.module.css';

export default function QuestionNode({ node, onNodeClick, isExpanded }) {
  const isQuestion = node.type === 'question';
  
  const handleClick = () => {
    if (isQuestion && !isExpanded) {
      onNodeClick(node.id);
    }
  };
  
  return (
    <div 
      className={`${styles.node} ${isQuestion ? styles.questionNode : styles.answerNode} ${!isExpanded && isQuestion ? styles.clickable : ''}`}
      onClick={handleClick}
    >
      <div className={styles.nodeContent}>
        {node.content}
      </div>
      {isQuestion && !isExpanded && (
        <div className={styles.expandIcon}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}
