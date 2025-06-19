import React from 'react';
import StatPanel from '../StatPanel/StatPanel';
import styles from './StatPanelTest.module.scss';

const StatPanelTest: React.FC = () => {
  return (
    <div className={styles.statPanelTest}>
      <h2>StatPanel Component Test</h2>
      <p>Testing the styled StatPanel component with exact original design</p>
      
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
          
          {/* StatPanel positioned like in original layout */}
          <div className={styles.statPanelContainer}>
            <StatPanel />
          </div>
          
          {/* Simulated TodoList area */}
          <div className={styles.todoListArea}>
            <div className={styles.todoListPlaceholder}>TodoList Area</div>
          </div>
        </div>
        
        <div className={styles.infoPanel}>
          <h3>Layout Information</h3>
          <p>This test shows the StatPanel positioned exactly as in the original layout:</p>
          <ul>
            <li>• Position: Absolute, top: 86px, right: 45px</li>
            <li>• Size: 20vw width, 30vh height</li>
            <li>• Background: #f6f6e9 (light beige)</li>
            <li>• Border: 2px solid #000 with 15px radius</li>
            <li>• Located in top-right area of the layout</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatPanelTest; 