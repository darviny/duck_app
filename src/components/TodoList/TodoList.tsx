import React from 'react';
import { TodoListProps } from '../../types/components';
import styles from './TodoList.module.scss';

const TodoList: React.FC<TodoListProps> = ({ className, id }) => {
  return (
    <div className={`${styles.todoList} ${className || ''}`} id={id}>
      <div className={styles.todoListContent}>
        <span className={styles.componentName}>Rubric</span>
        <div className={styles.placeholder}>
          Learning assessment rubric - will display evaluation criteria and progress tracking
        </div>
      </div>
    </div>
  );
};

export default TodoList; 