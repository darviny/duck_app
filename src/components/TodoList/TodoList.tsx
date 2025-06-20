import React from 'react';
import { TodoListProps } from '../../types/components';
import styles from './TodoList.module.scss';

interface AIEvaluationData {
  clarity: number;
  accuracy: number;
  engagement: number;
  suggestions: string[];
  evidence: string[];
  overall_comment: string;
}

interface ExtendedTodoListProps extends TodoListProps {
  onEvaluate?: () => void;
  isEvaluating?: boolean;
  aiEvaluation?: AIEvaluationData;
}

const TodoList: React.FC<ExtendedTodoListProps> = ({ 
  className, 
  id, 
  onEvaluate, 
  isEvaluating,
  aiEvaluation 
}) => {
  const hasEvaluationResults = aiEvaluation && (
    aiEvaluation.suggestions.length > 0 || 
    aiEvaluation.evidence.length > 0 || 
    aiEvaluation.overall_comment
  );

  return (
    <div className={`${styles.todoList} ${className || ''}`} id={id}>
      <div className={styles.todoListContent}>
        <span className={styles.componentName}>Rubric</span>
        
        {!hasEvaluationResults ? (
          <div className={styles.placeholder}>
            Learning assessment rubric - will display evaluation criteria and progress tracking
          </div>
        ) : (
          <div className={styles.evaluationResults}>
            {aiEvaluation?.overall_comment && (
              <div className={styles.overallComment}>
                <div className={styles.summaryPhrase}>
                  {aiEvaluation.overall_comment.split('.')[0]}.
                </div>
              </div>
            )}
            
            {aiEvaluation?.suggestions && aiEvaluation.suggestions.length > 0 && (
              <div className={styles.suggestionsSection}>
                <h4 className={styles.sectionTitle}>Suggestions for Improvement</h4>
                <ul className={styles.bulletList}>
                  {aiEvaluation.suggestions.map((suggestion, index) => (
                    <li key={index} className={styles.bulletItem}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {aiEvaluation?.evidence && aiEvaluation.evidence.length > 0 && (
              <div className={styles.evidenceSection}>
                <h4 className={styles.sectionTitle}>Supporting Evidence</h4>
                <ul className={styles.bulletList}>
                  {aiEvaluation.evidence.map((evidence, index) => (
                    <li key={index} className={styles.bulletItem}>
                      {evidence}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <button 
          className={styles.evaluateButton}
          onClick={onEvaluate}
          disabled={isEvaluating}
        >
          {isEvaluating ? 'Evaluating...' : 'Evaluate'}
        </button>
      </div>
    </div>
  );
};

export default TodoList; 