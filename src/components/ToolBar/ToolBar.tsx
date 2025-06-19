import React from 'react';
import styles from './ToolBar.module.scss';
import { 
  helpIcon, 
  arrowsOutputIcon, 
  pauseCircleIcon, 
  playCircleIcon, 
  stopCircleIcon 
} from '../../assets/index';

interface ToolBarProps {
  onHelp?: () => void;
  onFullScreen?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  showPlaybackControls?: boolean;
}

const ToolBar: React.FC<ToolBarProps> = ({
  onHelp,
  onFullScreen,
  onPlay,
  onPause,
  onStop,
  showPlaybackControls = false
}) => {
  return (
    <header className={styles.toolBar} role="banner" aria-label="Tool bar">
      <div className={styles.toolBarBg}>
        <div className={styles.toolsIcon}>
          {/* Left Controls - Playback Controls (optional) */}
          {showPlaybackControls && (
            <div className={styles.leftControls}>
              <button
                className={styles.stopCircleIcon}
                onClick={onStop}
                aria-label="Stop"
              >
                <img 
                  src={stopCircleIcon} 
                  alt="Stop" 
                  className={styles.controlIcon}
                />
              </button>
              <button
                className={styles.playCircleIcon}
                onClick={onPlay}
                aria-label="Play"
              >
                <img 
                  src={playCircleIcon} 
                  alt="Play" 
                  className={styles.controlIcon}
                />
              </button>
              <button
                className={styles.pauseCircleIcon}
                onClick={onPause}
                aria-label="Pause"
              >
                <img 
                  src={pauseCircleIcon} 
                  alt="Pause" 
                  className={styles.controlIcon}
                />
              </button>
            </div>
          )}
          
          {/* Right Controls - Help and Full Screen */}
          <div className={styles.rightControls}>
            <button
              className={styles.helpIcon}
              onClick={onHelp}
              aria-label="Help"
            >
              <img 
                src={helpIcon} 
                alt="Help" 
                className={styles.controlIcon}
              />
            </button>
            <button
              className={styles.arrowsOutputIcon}
              onClick={onFullScreen}
              aria-label="Full screen"
            >
              <img 
                src={arrowsOutputIcon} 
                alt="Full screen" 
                className={styles.controlIcon}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ToolBar; 