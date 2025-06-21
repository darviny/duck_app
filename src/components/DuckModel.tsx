import { DuckStates } from './web-gl-component/ThreeJSModules/enums';

/**
 * Parses AI messages to extract duck animation commands and controls the duck animation
 * AI can send messages like "{eat} Let me explain this while having a snack"
 * This function extracts the action, cleans the message, and controls the 3D duck animation
 * 
 * @param aiMessage - The raw message from the AI
 * @returns Object containing the animation action and clean message text
 */
export const parseAndControlDuckAnimation = (aiMessage: string): { 
  animationAction: DuckStates; 
  cleanMessageText: string 
} => {
  // Look for action commands in curly brackets at the start of the message
  // Example: "{eat} Hello there" -> action: "eat", message: "Hello there"
  const actionCommandMatch = aiMessage.match(/^\s*\{([^}]+)\}\s*(.*)/);
  
  let animationAction: DuckStates;
  let cleanMessage: string;
  
  if (actionCommandMatch) {
    const actionCommand = actionCommandMatch[1].trim().toLowerCase();
    cleanMessage = actionCommandMatch[2].trim();
    
    // Map the action text to our duck animation states
    switch (actionCommand) {
      case 'idle':
        animationAction = DuckStates.IDLE;
        break;
      case 'lay':
      case 'laying':
        animationAction = DuckStates.LAY;
        break;
      case 'eat':
      case 'eating':
        animationAction = DuckStates.EAT;
        break;
      default:
        // If we don't recognize the action, default to idle
        animationAction = DuckStates.IDLE;
        break;
    }
  } else {
    // No action command found, return idle and the original message
    animationAction = DuckStates.IDLE;
    cleanMessage = aiMessage;
  }
  
  // Control the 3D duck animation (if available)
  if (window.duckAnimationController) {
    window.duckAnimationController.nextAction = animationAction;
  }
  
  return { animationAction, cleanMessageText: cleanMessage };
}; 