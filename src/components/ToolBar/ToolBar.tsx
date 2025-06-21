import React from 'react';
import styles from './ToolBar.module.scss';
import { 
  helpIcon, 
  arrowsOutputIcon, 
  pauseCircleIcon, 
  playCircleIcon, 
  stopCircleIcon,
  duckIcon
} from '../../assets/index';

interface ToolBarProps {
  onHelp?: () => void;
  onFullScreen?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  showPlaybackControls?: boolean;
  useNewChatStyle?: boolean;
  onToggleChatStyle?: () => void;
  onToggleQuackMode?: () => void;
  quackMode?: boolean;
}

const ToolBar: React.FC<ToolBarProps> = ({
  onHelp,
  onFullScreen,
  onPlay,
  onPause,
  onStop,
  showPlaybackControls = false,
  useNewChatStyle = false,
  onToggleChatStyle,
  onToggleQuackMode,
  quackMode = false
}) => {
  return (
    <header className={styles.toolBar} role="banner" aria-label="Tool bar">
      <div className={styles.toolBarBg}>
        <div className={styles.toolsIcon}>
          {/* Left Controls - Duck Icon and Playback Controls (optional) */}
          <div className={styles.leftControls}>
            <button
              className={`${styles.duckIcon} ${quackMode ? styles.quackMode : ''}`}
              onClick={() => {
                console.log('🦆 Duck icon clicked!');
                if (onToggleQuackMode) {
                  onToggleQuackMode();
                } else {
                  console.log('❌ onToggleQuackMode is not defined');
                }
              }}
              aria-label="Toggle quack mode"
              title={quackMode ? "Quack mode: ON - Click to turn off" : "Quack mode: OFF - Click to turn on"}
            >
              <img 
                src={duckIcon} 
                alt="Darwin Duck" 
                className={styles.controlIcon}
              />
            </button>
            {showPlaybackControls && (
              <>
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
              </>
            )}
          </div>
          
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
            {onToggleChatStyle && (
              <button
                className={styles.chatStyleToggle}
                onClick={onToggleChatStyle}
                aria-label="Toggle chat style"
                style={{
                  background: useNewChatStyle ? '#272727' : '#f6f6e9',
                  color: useNewChatStyle ? '#ffffff' : '#000000',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginLeft: '10px'
                }}
              >
                Toggle
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ToolBar; 