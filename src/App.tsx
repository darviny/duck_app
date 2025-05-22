import './App.css';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  sender: string;
  content: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Ducky',
      content: "Quack! I'm ready to learn about 'velocity'. Can you explain it to me in simple terms?",
      isUser: false
    },
    {
      id: 2,
      sender: 'Sarah',
      content: "Velocity is the speed of something in a given direction. For example, a car traveling north at 60 mph has a velocity of 60 mph north.",
      isUser: true
    },
    {
      id: 3,
      sender: 'Ducky',
      content: "Quack! So, it's not just how fast something is moving, but also which way it's going?",
      isUser: false
    },
    {
      id: 4,
      sender: 'Sarah',
      content: "Exactly! Speed is just a number, but velocity includes the direction.",
      isUser: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'Sarah',
        content: inputValue,
        isUser: true
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#0d141c]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_543)">
                  <path
                    d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z"
                    fill="currentColor"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_543"><rect width="48" height="48" fill="white"></rect></clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em]">LinguaTeach</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#0d141c] text-sm font-medium leading-normal" href="#">Home</a>
              <a className="text-[#0d141c] text-sm font-medium leading-normal" href="#">Learn</a>
              <a className="text-[#0d141c] text-sm font-medium leading-normal" href="#">Teach</a>
              <a className="text-[#0d141c] text-sm font-medium leading-normal" href="#">Community</a>
            </div>
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#e7edf4] text-[#0d141c] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <div className="text-[#0d141c]" data-icon="Question" data-size="20px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"
                  ></path>
                </svg>
              </div>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCwjgz-d7ac6XsOmoEL-yIpZa5xyjxfPCc5on8EVAVwV6q08YNMDGb-qBbk9SNOWHMQgsM65ncmWT5YMyYeTAXLCVaVOcptmoQ8e_1aJMmBsTCv-Yr9cwkp-KgylfqbvtHpUkU2emWS6vSewjj2aFO5sSUu6t3IKcn6G6q1Iwl5njwlFN-SUJhBR15LzzNm1PlKTPbAkAdfH1rWqg0nWG5w_ucYTrDiZOpRavRiUnzylW5OBZdp2cT-StXjT31iVHptgsSKBa8h9Iw")' }}
            ></div>
          </div>
        </header>
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
            <h3 className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Turn 1/5</h3>
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-4">
                <p className="text-[#0d141c] text-sm font-medium leading-normal">Explain the concept of 'velocity'</p>
              </div>
            </div>
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[200px]"
            >
              {messages.map((message) => (
                <div key={message.id} className={`flex items-end gap-3 p-4 ${message.isUser ? 'justify-end' : ''}`}>
                  {!message.isUser && (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDJ337C3cyDat6d0B66PC4QPco4iK1zX95VjyDx3dGTpiqifmhVi5ROVWclm_Vnzh3vPi652rfl_H5uLdpaoNndnPo7OKHsuZIWSeLIvavlY8N9bsUT4Xhn5R4RIVvSW-Ta7r5AK-BP4_QhL66H15mUNri61B0xmAYpAwOhFhiT_nwPRJpa3MbIg04s_AVjuhnxA7cP524qH9VIXl8vMOLSHApNmyfEitSg06xWJ7WpDgxGBazJug55TJKa_JQIdf9sxCJ8Xp7s94w")' }}
                    ></div>
                  )}
                  <div className={`flex flex-1 flex-col gap-1 ${message.isUser ? 'items-end' : 'items-start'}`}>
                    <p className={`text-[#49739c] text-[13px] font-normal leading-normal max-w-[360px] ${message.isUser ? 'text-right' : ''}`}>
                      {message.sender}
                    </p>
                    <p className={`text-base font-normal leading-normal flex max-w-[360px] rounded-lg px-4 py-3 ${
                      message.isUser ? 'bg-[#0c7ff2] text-slate-50' : 'bg-[#e7edf4] text-[#0d141c]'
                    }`}>
                      {message.content}
                    </p>
                  </div>
                  {message.isUser && (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvYWX4RlWqXBATtjxxdLWUSgE0lx-o1RdYrt3c1NYjDUhXLsy5F8r3XJxTJa4Zd8dmQkERMZC3F1CbD6oe52uYYdQcCxYYURuQCyQBVn5Bfjf8W6qAXq77iYrAyRsFp3a-s5ZSVZeuFGmKhNaLbaWTt7zmI9mMDiS8k16w8WgMNrAwqM2-Dpi4xc02aTN5mn0wMbOoeTJIp7rItwRFaizlgzz6Am-yxD7OxndcBhPzWl-fxjvzj6urlexWcUZwr5wzeJFfS1fZQB0")' }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
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
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <div className="flex border-none bg-[#e7edf4] items-center justify-center pr-4 rounded-r-lg border-l-0 !pr-2">
                    <div className="flex items-center gap-4 justify-end">
                      <button
                        className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#0c7ff2] text-slate-50 text-sm font-medium leading-normal hidden @[480px]:block"
                        onClick={handleSendMessage}
                      >
                        <span className="truncate">Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div className="layout-content-container flex flex-col w-[360px]">
            <div className="flex flex-col gap-3 p-4">
              <div className="flex gap-6 justify-between">
                <p className="text-[#0d141c] text-base font-medium leading-normal">Confidence</p>
                <p className="text-[#0d141c] text-sm font-normal leading-normal">60%</p>
              </div>
              <div className="rounded bg-[#cedbe8]"><div className="h-2 rounded bg-[#0c7ff2]" style={{ width: '60%' }}></div></div>
            </div>
            <h3 className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Rubric</h3>
            <div className="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2 justify-between">
              <div className="flex flex-col justify-center">
                <p className="text-[#0d141c] text-base font-medium leading-normal line-clamp-1">Clarity</p>
                <p className="text-[#49739c] text-sm font-normal leading-normal line-clamp-2">Clear and concise explanation of the concept.</p>
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-[88px] overflow-hidden rounded-sm bg-[#cedbe8]"><div className="h-1 rounded-full bg-[#0c7ff2]" style={{ width: '90.9091%' }}></div></div>
                  <p className="text-[#0d141c] text-sm font-medium leading-normal">80</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2 justify-between">
              <div className="flex flex-col justify-center">
                <p className="text-[#0d141c] text-base font-medium leading-normal line-clamp-1">Accuracy</p>
                <p className="text-[#49739c] text-sm font-normal leading-normal line-clamp-2">Accurate use of terminology and definitions.</p>
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-[88px] overflow-hidden rounded-sm bg-[#cedbe8]"><div className="h-1 rounded-full bg-[#0c7ff2]" style={{ width: '79.5455%' }}></div></div>
                  <p className="text-[#0d141c] text-sm font-medium leading-normal">70</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2 justify-between">
              <div className="flex flex-col justify-center">
                <p className="text-[#0d141c] text-base font-medium leading-normal line-clamp-1">Engagement</p>
                <p className="text-[#49739c] text-sm font-normal leading-normal line-clamp-2">Engaging and interactive explanation.</p>
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-[88px] overflow-hidden rounded-sm bg-[#cedbe8]"><div className="h-1 rounded-full bg-[#0c7ff2]" style={{ width: '56.8182%' }}></div></div>
                  <p className="text-[#0d141c] text-sm font-medium leading-normal">50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
