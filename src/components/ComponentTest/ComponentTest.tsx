import React from 'react';
import Layout from '../Layout/Layout';
import styles from './ComponentTest.module.scss';

export const ComponentTest: React.FC = () => {
  return (
    <div className={styles.componentTest}>
      <h2>Component Integration Test</h2>
      <p>Testing all components together in the Layout</p>
      
      <Layout>
        <div className={styles.testContent}>
          <h3>Main Content Area</h3>
          <p>This area would contain the main application content.</p>
        </div>
      </Layout>
    </div>
  );
}; 