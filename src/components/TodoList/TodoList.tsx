import React from 'react';
import { TodoListProps } from '../../types/components';
import styles from './TodoList.module.scss';

interface ExtendedTodoListProps extends TodoListProps {
  onEvaluate?: () => void;
  isEvaluating?: boolean;
}

const TodoList: React.FC<ExtendedTodoListProps> = ({ className, id, onEvaluate, isEvaluating }) => {
  return (
    <div className={`${styles.todoList} ${className || ''}`} id={id}>
      <div className={styles.todoListContent}>
        <span className={styles.componentName}>Rubric</span>
        <div className={styles.placeholder}>
          Learning assessment rubric - will display evaluation criteria and progress tracking
        </div>
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