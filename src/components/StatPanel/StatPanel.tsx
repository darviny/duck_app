import React from 'react';
import { StatPanelProps } from '../../types/components';
import styles from './StatPanel.module.scss';

const StatPanel: React.FC<StatPanelProps> = ({ className, id }) => {
  return (
    <div className={`${styles.statPanel} ${className || ''}`} id={id}>
      <div className={styles.statPanelContent}>
        <span className={styles.componentName}>StatPanel Component</span>
        <div className={styles.placeholder}>
          Statistics panel placeholder - will display user statistics and progress
        </div>
      </div>
    </div>
  );
};

export default StatPanel; 