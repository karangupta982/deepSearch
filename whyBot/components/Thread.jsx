import React, { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Thread({ x1, y1, x2, y2, id, onDeleteThread }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate the midpoint of the thread for scissors icon placement
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  // Calculate the angle of the thread for proper scissors rotation
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  
  return (
    <g 
      className={styles.thread}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The actual connecting line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isHovered ? "#ff6b6b" : "#666"}
        strokeWidth={isHovered ? 2 : 1}
        strokeDasharray={isHovered ? "4 2" : "none"}
      />
      
      {/* Scissors icon that appears on hover */}
      {isHovered && (
        <g 
          transform={`translate(${midX}, ${midY}) rotate(${angle})`}
          onClick={() => onDeleteThread(id)}
          className={styles.scissorsIcon}
        >
          <circle cx="0" cy="0" r="12" fill="#333" />
          <path 
            d="M-6,-3 C-5,-1 -5,1 -6,3 M-6,-3 C-4,-2 -2,-2 0,-3 M0,-3 C2,-2 4,-2 6,-3 M6,-3 C5,-1 5,1 6,3 M-6,3 C-4,2 -2,2 0,3 M0,3 C2,2 4,2 6,3"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </g>
      )}
    </g>
  );
}