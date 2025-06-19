import React from 'react';
import TodoList from '../TodoList/TodoList';
import styles from './TodoListTest.module.scss';

const TodoListTest: React.FC = () => {
  return (
    <div className={styles.todoListTest}>
      <h2>TodoList Component Test</h2>
      <p>Testing the styled TodoList component with exact original design</p>
      
      <div className={styles.testContainer}>
        {/* Simulate the main layout structure */}
        <div className={styles.layoutSimulation}>
          {/* Simulated NavBar area */}
          <div className={styles.navBarArea}>
            <div className={styles.navBarPlaceholder}>NavBar Area (327px width)</div>
          </div>
          
          {/* Simulated ToolBar area */}
          <div className={styles.toolBarArea}>
            <div className={styles.toolBarPlaceholder}>ToolBar Area (51px height)</div>
          </div>
          
          {/* Simulated WebGL area */}
          <div className={styles.webglArea}>
            <div className={styles.webglPlaceholder}>WebGL Component Area</div>
          </div>
          
          {/* Simulated StatPanel area */}
          <div className={styles.statPanelArea}>
            <div className={styles.statPanelPlaceholder}>StatPanel Area (20vw × 30vh)</div>
          </div>
          
          {/* TodoList positioned like in original layout */}
          <div className={styles.todoListContainer}>
            <TodoList />
          </div>
        </div>
        
        <div className={styles.infoPanel}>
          <h3>Layout Information</h3>
          <p>This test shows the TodoList positioned exactly as in the original layout:</p>
          <ul>
            <li>• Position: Absolute, top: 451px, right: 45px</li>
            <li>• Size: 20vw width, 55vh height</li>
            <li>• Background: #f6f6e9 (light beige)</li>
            <li>• Border: 2px solid #000 with 15px radius</li>
            <li>• Located in bottom-right area of the layout</li>
            <li>• Bottom: 86px from bottom edge</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoListTest; 