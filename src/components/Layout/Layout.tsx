import React, { useState, useRef, useEffect } from 'react';
import { LayoutProps as OriginalLayoutProps } from '../../types/components';
import NavBar from '../NavBar/NavBar';
import ToolBar from '../ToolBar/ToolBar';
import StatPanel from '../StatPanel/StatPanel';
import TodoList from '../TodoList/TodoList';
import { WebGLComponent } from '../web-gl-component/web-gl-component';
import { PopUpModalComponent } from '../pop-up-modal-component/pop-up-modal-component';
import styles from './Layout.module.scss';

// Make children optional
export interface LayoutProps extends Omit<OriginalLayoutProps, 'children'> {
  children?: React.ReactNode;
  isAuthenticated?: boolean;
  user?: any;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onNewDuck?: () => void;
  aiEvaluation?: {
    clarity: number;
    accuracy: number;
    engagement: number;
    suggestions: string[];
    evidence: string[];
    overall_comment: string;
  };
  onEvaluate?: () => void;
  isEvaluating?: boolean;
}

const AUTOHIDE_DELAY = 1500; // ms
const EDGE_TRIGGER_WIDTH = 32; // px

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className, 
  id, 
  isAuthenticated = false,
  user,
  onSignIn,
  onSignOut,
  onNewDuck,
  aiEvaluation,
  onEvaluate,
  isEvaluating
}) => {
  // State for Help modal
  const [showHelp, setShowHelp] = useState(false);
  // Ref for fullscreen
  const layoutRef = useRef<HTMLDivElement>(null);

  // NavBar autohide state
  const [navBarVisible, setNavBarVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // If mouse is near the left edge, show NavBar
      if (e.clientX <= EDGE_TRIGGER_WIDTH) {
        setNavBarVisible(true);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      } else {
        // Reset hide timer
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
          setNavBarVisible(false);
        }, AUTOHIDE_DELAY);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Show NavBar on hover
  const handleNavBarMouseEnter = () => {
    setNavBarVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  };
  const handleNavBarMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setNavBarVisible(false);
    }, AUTOHIDE_DELAY);
  };

  // Event handlers for NavBar
  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      console.log('Sign In clicked');
    }
  };

  const handleNewDuck = () => {
    if (onNewDuck) {
      onNewDuck();
    } else {
      console.log('New Duck clicked');
    }
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

  // Event handlers for ToolBar
  const handleHelp = () => {
    setShowHelp(true);
  };

  const handleFullScreen = () => {
    const elem = layoutRef.current;
    if (!elem) return;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
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

  // Close modal handler
  const handleCloseHelp = () => setShowHelp(false);

  return (
    <div ref={layoutRef} className={`${styles.layout} ${className || ''}`} id={id}>
      <div
        className={
          styles.navBarContainer +
          (navBarVisible ? ' ' + styles.navBarVisible : ' ' + styles.navBarHidden)
        }
        onMouseEnter={handleNavBarMouseEnter}
        onMouseLeave={handleNavBarMouseLeave}
      >
        <NavBar
          isAuthenticated={isAuthenticated}
          user={user}
          isVisible={navBarVisible}
          onSignIn={handleSignIn}
          onSignOut={onSignOut}
          onNewDuck={handleNewDuck}
          onCourses={handleCourses}
          onStudyPlan={handleStudyPlan}
          onSettings={handleSettings}
          onToggleVisibility={() => setNavBarVisible(true)}
        />
      </div>
      
      <div className={styles.toolBarContainer}>
        <ToolBar
          onHelp={handleHelp}
          onFullScreen={handleFullScreen}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          showPlaybackControls={false}
        />
      </div>
      
      <div className={styles.mainContent}>
        {children}
      </div>
      
      <div className={styles.statPanelContainer}>
        <WebGLComponent 
          aiEvaluation={aiEvaluation}
        />
      </div>
      
      {/* Rubric Panel (formerly TodoList) */}
      <div className={styles.todoListContainer}>
        <TodoList 
          onEvaluate={onEvaluate}
          isEvaluating={isEvaluating}
        />
      </div>
      {/* Help Modal */}
      {showHelp && (
        <div style={{ position: 'fixed', zIndex: 10000, top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)' }} onClick={handleCloseHelp}>
          <div style={{ position: 'relative', width: 'fit-content', margin: '60px auto' }} onClick={e => e.stopPropagation()}>
            <PopUpModalComponent onClose={handleCloseHelp} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout; 