import React from 'react';
import { TodoListProps } from '../../types/components';
import styles from './TodoList.module.scss';

const TodoList: React.FC<TodoListProps> = ({ className, id }) => {
  return (
    <div className={`${styles.todoList} ${className || ''}`} id={id}>
      <div className={styles.todoListContent}>
        <span className={styles.componentName}>TodoList Component</span>
        <div className={styles.placeholder}>
          Todo list placeholder - will display user tasks and activities
        </div>
      </div>
    </div>
  );
};

export default TodoList; 