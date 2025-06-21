import React from 'react';
import { RubricProps } from '../../types/components';
import styles from './Rubric.module.scss';

interface AIEvaluationData {
  clarity: number;
  accuracy: number;
  engagement: number;
  suggestions: string[];
  evidence: string[];
  overall_comment: string;
}

interface ExtendedRubricProps extends RubricProps {
  onEvaluate?: () => void;
  isEvaluating?: boolean;
  aiEvaluation?: AIEvaluationData;
}

const Rubric: React.FC<ExtendedRubricProps> = ({ 
  className, 
  id, 
  onEvaluate, 
  isEvaluating,
  aiEvaluation 
}) => {
  const hasEvaluationResults = aiEvaluation && (
    aiEvaluation.suggestions.length > 0 || 
    aiEvaluation.overall_comment
  );

  return (
    <div className={`${styles.rubric} ${className || ''}`} id={id}>
      <div className={styles.rubricContent}>
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
                  {aiEvaluation.suggestions.map((suggestion, index) => {
                    // Extract only the first sentence
                    const firstSentence = suggestion.split('.')[0] + '.';
                    return (
                      <li key={index} className={styles.bulletItem}>
                        <span className={styles.suggestionText}>{firstSentence}</span>
                      </li>
                    );
                  })}
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

export default Rubric; 