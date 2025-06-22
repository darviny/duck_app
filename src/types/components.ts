/**
 * TypeScript interfaces for component props
 */

// Base component props interface
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

// Navigation Bar component props
export interface NavBarProps extends BaseComponentProps {
  onSignIn?: () => void;
  onNewDuck?: () => void;
  onCourses?: () => void;
  onStudyPlan?: () => void;
  onSettings?: () => void;
}

// Toolbar component props
export interface ToolBarProps extends BaseComponentProps {
  onHelp?: () => void;
  useNewChatStyle?: boolean;
  onToggleChatStyle?: () => void;
  onToggleQuackMode?: () => void;
  quackMode?: boolean;
  webglRef?: React.RefObject<HTMLDivElement>;
}

// Stat Panel component props
export interface StatPanelProps extends BaseComponentProps {
  // Stat panel-specific props can be added here
}

// Rubric component props
export interface RubricProps extends BaseComponentProps {
  // Rubric-specific props can be added here
}

// Layout component props
export interface LayoutProps extends BaseComponentProps {
  children: React.ReactNode;
}

// Asset component props
export interface AssetProps extends BaseComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// Button component props
export interface ButtonProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

// Input component props
export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
} 