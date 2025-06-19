import React from 'react';
import NavBar from '../NavBar/NavBar';
import styles from './NavBarTest.module.scss';

const NavBarTest: React.FC = () => {
  const handleSignIn = () => {
    console.log('Sign In clicked');
  };

  const handleNewDuck = () => {
    console.log('New Duck clicked');
  };

  const handleCourses = () => {
    console.log('Courses clicked');
  };

  const handleStudyPlan = () => {
    console.log('Study Plan clicked');
  };

  const handleSettings = () => {
    console.log('Settings clicked');
  };

  return (
    <div className={styles.navBarTest}>
      <h2>NavBar Component Test</h2>
      <p>Testing the styled NavBar component with exact original design</p>
      
      <div className={styles.testContainer}>
        <NavBar
          onSignIn={handleSignIn}
          onNewDuck={handleNewDuck}
          onCourses={handleCourses}
          onStudyPlan={handleStudyPlan}
          onSettings={handleSettings}
        />
        
        <div className={styles.contentArea}>
          <h3>Content Area</h3>
          <p>This simulates the main content area that would be positioned next to the NavBar.</p>
          <p>The NavBar should be fixed on the left side with proper styling.</p>
        </div>
      </div>
    </div>
  );
};

export default NavBarTest; 