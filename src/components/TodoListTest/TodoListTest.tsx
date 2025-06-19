import React from 'react';
import TodoList from '../TodoList/TodoList';
import styles from './TodoListTest.module.scss';

const TodoListTest: React.FC = () => {
  return (
    <div className={styles.testContainer}>
      <h2 className={styles.testTitle}>Rubric Component Test</h2>
      <div className={styles.componentWrapper}>
        <TodoList />
      </div>
      <div className={styles.testInfo}>
        <p>This is a test of the Rubric component with its original styling and positioning.</p>
        <p>The component should display "Rubric" as the title and show placeholder text about learning assessment.</p>
      </div>
    </div>
  );
};

export default TodoListTest; 