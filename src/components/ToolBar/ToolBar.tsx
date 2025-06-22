import React from 'react';
import styles from './ToolBar.module.scss';
import { 
  helpIcon, 
  arrowsOutputIcon, 
  duckIcon
} from '../../assets/index';
import { ToolBarProps } from '../../types/components';

// Extracted fullscreen handler function
const handleFullScreen = (webglRef?: React.RefObject<HTMLDivElement>) => {
  const webglElement = webglRef?.current;
  if (!webglElement) return;
  
  if (!document.fullscreenElement) {
    // Enter fullscreen
    webglElement.requestFullscreen().catch(err => {
      console.error('Error entering fullscreen:', err);
    });
  } else {
    // Exit fullscreen
    document.exitFullscreen().catch(err => {
      console.error('Error exiting fullscreen:', err);
    });
  }
};

const ToolBar: React.FC<ToolBarProps> = ({
  onHelp,
  useNewChatStyle = false,
  onToggleChatStyle,
  onToggleQuackMode,
  quackMode = false,
  webglRef
}) => {
  return (
    <header className={styles.toolBar} role="banner" aria-label="Tool bar">
      <div className={styles.toolBarBg}>
        <div className={styles.toolsIcon}>
          {/* Left Controls - Empty for now */}
          <div className={styles.leftControls}>
          </div>
          
          {/* Right Controls - Help, Full Screen, and Duck Icon */}
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
              onClick={() => handleFullScreen(webglRef)}
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
                className={`${styles.chatStyleToggle} ${useNewChatStyle ? styles.newStyle : ''}`}
                onClick={onToggleChatStyle}
                aria-label="Toggle chat style"
              >
                Toggle
              </button>
            )}
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default ToolBar; 