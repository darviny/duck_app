import React from 'react';

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
  return (
    <div className="flex items-center px-4 py-3 gap-3 @container">
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBl4zJUJUPMRt_pC-P-4fMNSP1tr9HA3w616rW_feI3OK2tmgkr7mnWE1-7oXrjXZ9jrgoN3BCS51x3UMwxV9om9CZ6Jbd3hY9diKaDeXFbdx7j9qXc0EhksW6eYGgP6BzGLuCrWbqklvgXorZIZPRlZzVLR09QMkVaN8VqjBLoI71onsmI1yjzAJuE_F3-xC4L9ziYSDn-HJupk29g_igiobyrWaxxlrqC-9Pu8uCjW-1lwoL73rp19Xi2cZwkCl4r9_bX8z1C0Xg")' }}
      ></div>
      <label className="flex flex-col min-w-40 h-12 flex-1">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
          <input
            placeholder="Explain the concept to Ducky"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] focus:border-none h-full placeholder:text-[#49739c] px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
          />
          <div className="flex border-none bg-[#e7edf4] items-center justify-center pr-4 rounded-r-lg border-l-0 !pr-2">
            <div className="flex items-center gap-4 justify-end">
              <button
                className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#0c7ff2] text-slate-50 text-sm font-medium leading-normal hidden @[480px]:block"
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