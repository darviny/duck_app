import React, { useState } from 'react';
import ToolBar from '../ToolBar/ToolBar';
import styles from './ToolBarTest.module.scss';

const ToolBarTest: React.FC = () => {
  const [showPlaybackControls, setShowPlaybackControls] = useState(false);

  const handleHelp = () => {
    console.log('Help clicked');
  };

  const handleFullScreen = () => {
    console.log('Full screen clicked');
  };

  const handlePlay = () => {
    console.log('Play clicked');
  };

  const handlePause = () => {
    console.log('Pause clicked');
  };

  const handleStop = () => {
    console.log('Stop clicked');
  };

  return (
    <div className={styles.toolBarTest}>
      <h2>ToolBar Component Test</h2>
      <p>Testing the styled ToolBar component with exact original design</p>
      
      <div className={styles.controls}>
        <label>
          <input
            type="checkbox"
            checked={showPlaybackControls}
            onChange={(e) => setShowPlaybackControls(e.target.checked)}
          />
          Show Playback Controls
        </label>
      </div>
      
      <div className={styles.testContainer}>
        <ToolBar
          onHelp={handleHelp}
          onFullScreen={handleFullScreen}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          showPlaybackControls={showPlaybackControls}
        />
        
        <div className={styles.contentArea}>
          <h3>Content Area</h3>
          <p>This simulates the main content area below the ToolBar.</p>
          <p>The ToolBar should be positioned at the top with proper styling.</p>
          <p>Current configuration: {showPlaybackControls ? 'With' : 'Without'} playback controls</p>
        </div>
      </div>
    </div>
  );
};

export default ToolBarTest; 