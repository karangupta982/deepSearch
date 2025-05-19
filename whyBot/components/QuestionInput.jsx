import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function QuestionInput({ onSubmitQuestion, onRandomQuestion }) {
  const [question, setQuestion] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmitQuestion(question.trim());
      setQuestion('');
    }
  };
  
  return (
    <div className={styles.inputContainer}>
      <h2 className={styles.inputTitle}>What would you like to understand?</h2>
      
      <form onSubmit={handleSubmit} className={styles.questionForm}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Why..."
          className={styles.questionInput}
        />
        <button type="submit" className={styles.submitButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 7L20 12L15 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
      
      <div className={styles.randomContainer}>
        <button onClick={onRandomQuestion} className={styles.randomButton}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 10L2 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 2V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Suggest random question
        </button>
      </div>
      
      <div className={styles.exampleRuns}>
        <h3>Play example runs</h3>
        <div className={styles.examplesList}>
          <button onClick={() => onSubmitQuestion("Can quantum computers reduce the time complexity of a problem?")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L13 8L3 13V3Z" fill="currentColor"/>
            </svg>
            Can quantum computers reduce the time complexity of a problem?
          </button>
          <button onClick={() => onSubmitQuestion("Where does runner's high come from?")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L13 8L3 13V3Z" fill="currentColor"/>
            </svg>
            Where does runner's high come from?
          </button>
          <button onClick={() => onSubmitQuestion("Why do we yawn?")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L13 8L3 13V3Z" fill="currentColor"/>
            </svg>
            Why do we yawn?
          </button>
        </div>
      </div>
    </div>
  );
}