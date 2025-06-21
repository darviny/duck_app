import React, { useState, useRef, useEffect } from 'react';
import styles from './NavBar.module.scss';
import { 
  logoIcon, 
  iconNewduck, 
  iconCourses, 
  iconStudyplan, 
  iconSettings 
} from '../../assets/index';

interface NavBarProps {
  isAuthenticated?: boolean;
  user?: any;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onNewDuck?: () => void;
  onCourses?: () => void;
  onStudyPlan?: () => void;
  onSettings?: () => void;
}

const AUTOHIDE_DELAY = 1000; // ms
const EDGE_TRIGGER_WIDTH = 64; // px

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

  // Auto-hide logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // If mouse is near the left edge, show NavBar
      if (e.clientX <= EDGE_TRIGGER_WIDTH) {
        setIsVisible(true);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      } else {
        // Reset hide timer
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
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
  const handleMouseEnter = () => {
    setIsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, AUTOHIDE_DELAY);
  };

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
            <li className={styles.navItem}>
              <a 
                href="#" 
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  onNewDuck?.();
                }}
                aria-label="Create new duck"
              >
                <img 
                  src={iconNewduck} 
                  alt="New Duck" 
                  className={styles.navIcon}
                />
                <span className={styles.navText}>New Duck</span>
              </a>
            </li>
            <li className={styles.navItem}>
              <a 
                href="#" 
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  onCourses?.();
                }}
                aria-label="Courses"
              >
                <img 
                  src={iconCourses} 
                  alt="Courses" 
                  className={styles.navIcon}
                />
                <span className={styles.navText}>Courses</span>
              </a>
            </li>
            <li className={styles.navItem}>
              <a 
                href="#" 
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  onStudyPlan?.();
                }}
                aria-label="Study Plan"
              >
                <img 
                  src={iconStudyplan} 
                  alt="Study Plan" 
                  className={styles.navIcon}
                />
                <span className={styles.navText}>Study Plan</span>
              </a>
            </li>
            <li className={styles.navItem}>
              <a 
                href="#" 
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  onSettings?.();
                }}
                aria-label="Settings"
              >
                <img 
                  src={iconSettings} 
                  alt="Settings" 
                  className={styles.navIcon}
                />
                <span className={styles.navText}>Settings</span>
              </a>
            </li>
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