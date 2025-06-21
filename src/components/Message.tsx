import React, { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface MessageProps {
  id: number;
  sender: string;
  content: string;
  isUser: boolean;
  useNewStyle?: boolean;
  isLatestUserMessage?: boolean;
  aiEvaluation?: {
    clarity: number;
    accuracy: number;
    engagement: number;
    suggestions: string[];
    evidence: string[];
    overall_comment: string;
  };
}

const Message: React.FC<MessageProps> = ({ id, sender, content, isUser, useNewStyle = false, isLatestUserMessage = false, aiEvaluation }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const messageRef = useRef<HTMLParagraphElement>(null);
  const cachedEvidenceRef = useRef<string[]>([]);

  // Cache the parsed evidence reasoning strings
  // Only update cache for the latest user message or if no cache exists
  const cachedEvidence = useMemo(() => {
    if (!aiEvaluation || !aiEvaluation.evidence || !isUser) return [];
    
    // If this is the latest user message, process and cache the evidence
    if (isLatestUserMessage) {
      // Look for evidence that mentions this message's content
      const relevantEvidence = aiEvaluation.evidence.filter(evidence => 
        evidence.toLowerCase().includes(content.toLowerCase().substring(0, 20)) ||
        evidence.includes(`Message ID ${id}`)
      );
      
      // Parse and cache the reasoning for each piece of evidence
      const parsedEvidence = relevantEvidence.map(evidence => {
        // Extract reasoning from formats like:
        // "Engagement - Message ID 2: The response is short..."
        // "Clarity - Message ID 2: 'hi' - The learner's response..."
        let reasoning = '';
        
        // Look for the pattern: Message ID {number}: {reasoning}
        const messageIdMatch = evidence.match(/Message ID \d+:\s*(.+)/);
        if (messageIdMatch) {
          reasoning = messageIdMatch[1].trim();
        } else {
          // Fallback: look for the last dash in the string and take everything after it
          const lastDashIndex = evidence.lastIndexOf(' - ');
          if (lastDashIndex !== -1) {
            reasoning = evidence.substring(lastDashIndex + 3).trim(); // +3 to skip " - "
          } else {
            // Last resort: try to get everything after the first "-" (without space)
            const parts = evidence.split('-');
            if (parts.length > 1) {
              reasoning = parts.slice(1).join('-').trim();
            } else {
              reasoning = evidence;
            }
          }
        }
        
        return reasoning;
      });
      
      // Update the cached evidence
      cachedEvidenceRef.current = parsedEvidence;
      return parsedEvidence;
    } else {
      // For older messages, return the cached evidence
      return cachedEvidenceRef.current;
    }
  }, [aiEvaluation, content, id, isUser, isLatestUserMessage]);

  const handleMouseEnter = () => {
    if (isUser && messageRef.current) {
      const rect = messageRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 10, // Position above the message
        left: rect.left
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className={`flex items-end gap-3 p-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDJ337C3cyDat6d0B66PC4QPco4iK1zX95VjyDx3dGTpiqifmhVi5ROVWclm_Vnzh3vPi652rfl_H5uLdpaoNndnPo7OKHsuZIWSeLIvavlY8N9bsUT4Xhn5R4RIVvSW-Ta7r5AK-BP4_QhL66H15mUNri61B0xmAYpAwOhFhiT_nwPRJpa3MbIg04s_AVjuhnxA7cP524qH9VIXl8vMOLSHApNmyfEitSg06xWJ7WpDgxGBazJug55TJKa_JQIdf9sxCJ8Xp7s94w")' }}
        ></div>
      )}
      <div className={`flex flex-1 flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <p className={`text-[#000000] text-[16px] font-semibold leading-normal max-w-[600px] font-['Tiny5'] ${isUser ? 'text-right' : ''}`}>
          {sender}
        </p>
        <div className="relative">
          <p 
            ref={messageRef}
            className={`text-sm font-normal leading-normal flex max-w-[600px] rounded-lg px-4 py-3 text-left cursor-pointer transition-all duration-200 ${
              isUser ? 'bg-[#272727] text-[#ffffff] hover:bg-[#1a1a1a]' : 
              useNewStyle ? 'bg-[#e0e0e0] text-[#000000] border-2 border-[#000000]' : 
              'bg-[#f6f6e9] text-[#000000] border-2 border-[#000000]'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {content}
          </p>
        </div>
      </div>
      {isUser && (
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvYWX4RlWqXBATtjxxdLWUSgE0lx-o1RdYrt3c1NYjDUhXLsy5F8r3XJxTJa4Zd8dmQkERMZC3F1CbD6oe52uYYdQcCxYYURuQCyQBVn5Bfjf8W6qAXq77iYrAyRsFp3a-s5ZSVZeuFGmKhNaLbaWTt7zmI9mMDiS8k16w8WgMNrAwqM2-Dpi4xc02aTN5mn0wMbOoeTJIp7rItwRFaizlgzz6Am-yxD7OxndcBhPzWl-fxjvzj6urlexWcUZwr5wzeJFfS1fZQB0")' }}
        ></div>
      )}
      
      {/* Portal-based Tooltip */}
      {showTooltip && isUser && cachedEvidence.length > 0 && createPortal(
        <div 
          className="fixed px-3 py-2 bg-[#000000] text-[#ffffff] text-xs rounded-lg shadow-lg z-[9999] w-64"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="space-y-1">
            {cachedEvidence.map((reasoning, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-[#ffffff] font-bold mt-0.5">•</span>
                <span className="text-[11px] leading-tight flex-1 text-left">
                  {reasoning}
                </span>
              </div>
            ))}
          </div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#000000]"></div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Message; 