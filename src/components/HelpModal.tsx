import React from 'react';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', zIndex: 10000, top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div style={{ position: 'relative', width: 'fit-content', margin: '60px auto', background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default HelpModal; 