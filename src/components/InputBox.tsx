import React, { useRef, useEffect } from 'react';

interface InputBoxProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const InputBox: React.FC<InputBoxProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  onKeyPress,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  return (
    <div className="flex items-start px-4 py-3 gap-3 @container">
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0 mt-2"
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBl4zJUJUPMRt_pC-P-4fMNSP1tr9HA3w616rW_feI3OK2tmgkr7mnWE1-7oXrjXZ9jrgoN3BCS51x3UMwxV9om9CZ6Jbd3hY9diKaDeXFbdx7j9qXc0EhksW6eYGgP6BzGLuCrWbqklvgXorZIZPRlZzVLR09QMkVaN8VqjBLoI71onsmI1yjzAJuE_F3-xC4L9ziYSDn-HJupk29g_igiobyrWaxxlrqC-9Pu8uCjW-1lwoL73rp19Xi2cZwkCl4r9_bX8z1C0Xg")' }}
      ></div>
      <label className="flex flex-col min-w-40 flex-1">
        <div className="flex w-full items-stretch rounded-lg">
          <textarea
            ref={textareaRef}
            placeholder="Explain the concept to Darwin the Duck"
            className="form-textarea flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#000000] focus:outline-0 focus:ring-0 border-2 border-[#000000] bg-[#f6f6e9] focus:border-[#000000] placeholder:text-[#888888] px-4 py-3 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal min-h-[96px] max-h-[150px]"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            rows={1}
          />
          <div className="flex border-2 border-l-0 border-[#000000] bg-[#f6f6e9] items-center justify-center pr-4 rounded-r-lg !pr-2">
            <div className="flex items-center gap-4 justify-end">
              <button
                className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#272727] text-[#ffffff] text-sm font-semibold leading-normal hidden @[480px]:block hover:bg-[#000000] transition-colors"
                onClick={onSendMessage}
              >
                <span className="truncate">Send</span>
              </button>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default InputBox; 