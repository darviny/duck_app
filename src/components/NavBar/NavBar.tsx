import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './NavBar.module.scss';
import { 
  logoIcon, 
  iconNewduck, 
  iconCourses, 
  iconStudyplan, 
  iconSettings 
} from '../../assets/index';

interface User {
  // AWS Amplify getCurrentUser() properties
  userId: string;
  username: string;
  
  // AWS Amplify fetchUserAttributes() properties
  attributes?: {
    email?: string;
    email_verified?: boolean;
    sub?: string;
    [key: string]: any; // Allow for other potential attributes
  };
}

interface NavBarProps {
  isAuthenticated?: boolean;
  user?: User;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onNewDuck?: () => void;
  onCourses?: () => void;
  onStudyPlan?: () => void;
  onSettings?: () => void;
}

interface NavigationLinkProps {
  icon: string;
  text: string;
  onClick?: () => void;
  ariaLabel: string;
}

const AUTOHIDE_DELAY = 1000; // ms
const EDGE_TRIGGER_PERCENTAGE = 5; // 5% of screen width
const INITIAL_SHOW_DURATION = 1000; // ms

// Reusable Navigation Link Component
const NavigationLink: React.FC<NavigationLinkProps> = ({ icon, text, onClick, ariaLabel }) => (
  <li className={styles.navItem}>
    <a 
      href="#" 
      className={styles.navLink}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      aria-label={ariaLabel}
    >
      <img 
        src={icon} 
        alt={text} 
        className={styles.navIcon}
      />
      <span className={styles.navText}>{text}</span>
    </a>
  </li>
);

const NavBar: React.FC<NavBarProps> = ({
  isAuthenticated = false,
  user,
  onSignIn,
  onSignOut,
  onNewDuck,
  onCourses,
  onStudyPlan,
  onSettings
}) => {
  // Auto-hide state management
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNearBoundary = useRef(false);

  // Show navbar for 1 second on initial load, then hide it
  useEffect(() => {
    const initialHideTimer = setTimeout(() => {
      setIsVisible(false);
    }, INITIAL_SHOW_DURATION);

    return () => {
      clearTimeout(initialHideTimer);
    };
  }, []);

  // Boundary detection mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const edgeTriggerWidth = (window.innerWidth * EDGE_TRIGGER_PERCENTAGE) / 100;
    const nearBoundary = e.clientX <= edgeTriggerWidth;
    
    // Only process if crossing the boundary or already near it
    if (nearBoundary !== isNearBoundary.current || nearBoundary) {
      isNearBoundary.current = nearBoundary;
      
      if (nearBoundary) {
        setIsVisible(true);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      } else {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, AUTOHIDE_DELAY);
      }
    }
  }, []);

  // Window resize handler to update boundary calculations
  const handleWindowResize = useCallback(() => {
    // If navbar is currently hidden, check if mouse is now in boundary area
    // This prevents the navbar from staying hidden if resize puts mouse in boundary
    if (!isVisible && isNearBoundary.current) {
      // Mouse was in boundary before resize, ensure navbar stays visible
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    }
  }, [isVisible]);

  // Auto-hide logic with boundary detection and resize handling
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleWindowResize);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [handleMouseMove, handleWindowResize]);

  // Show NavBar on hover
  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, AUTOHIDE_DELAY);
  }, []);

  return (
    <nav 
      className={`${styles.navBar} ${isVisible ? styles.navBarVisible : styles.navBarHidden}`}
      role="navigation" 
      aria-label="Main navigation"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background */}
      <div className={styles.navBarBg}></div>
      
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img 
          src={logoIcon} 
          alt="Darwin Duck Logo" 
          className={styles.logoIcon}
        />
      </div>
      
      {/* Navigation Links */}
      <div className={styles.navigationLinks}>
        <div className={styles.linksContainer}>
          <ul className={styles.navList}>
            <NavigationLink 
              icon={iconNewduck} 
              text="New Duck" 
              onClick={onNewDuck} 
              ariaLabel="Create new duck"
            />
            <NavigationLink 
              icon={iconCourses} 
              text="Courses" 
              onClick={onCourses} 
              ariaLabel="Courses"
            />
            <NavigationLink 
              icon={iconStudyplan} 
              text="Study Plan" 
              onClick={onStudyPlan} 
              ariaLabel="Study Plan"
            />
            <NavigationLink 
              icon={iconSettings} 
              text="Settings" 
              onClick={onSettings} 
              ariaLabel="Settings"
            />
          </ul>
        </div>
      </div>
      
      {/* Authentication Section */}
      <div className={styles.signInContainer}>
        {isAuthenticated ? (
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user?.attributes?.email || user?.username || 'User'}
              </span>
            </div>
            <button 
              className={styles.signOutButton}
              onClick={onSignOut}
              aria-label="Sign out"
            >
              <span className={styles.signOutText}>Sign Out</span>
            </button>
          </div>
        ) : (
          <button 
            className={styles.signInButton}
            onClick={onSignIn}
            aria-label="Sign in"
          >
            <span className={styles.signInText}>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;