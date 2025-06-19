import React from 'react';

interface MessageProps {
  id: number;
  sender: string;
  content: string;
  isUser: boolean;
}

const Message: React.FC<MessageProps> = ({ sender, content, isUser }) => {
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
        <p className={`text-sm font-normal leading-normal flex max-w-[600px] rounded-lg px-4 py-3 text-left ${
          isUser ? 'bg-[#272727] text-[#ffffff]' : 'bg-[#f6f6e9] text-[#000000] border-2 border-[#000000]'
        }`}>
          {content}
        </p>
      </div>
      {isUser && (
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvYWX4RlWqXBATtjxxdLWUSgE0lx-o1RdYrt3c1NYjDUhXLsy5F8r3XJxTJa4Zd8dmQkERMZC3F1CbD6oe52uYYdQcCxYYURuQCyQBVn5Bfjf8W6qAXq77iYrAyRsFp3a-s5ZSVZeuFGmKhNaLbaWTt7zmI9mMDiS8k16w8WgMNrAwqM2-Dpi4xc02aTN5mn0wMbOoeTJIp7rItwRFaizlgzz6Am-yxD7OxndcBhPzWl-fxjvzj6urlexWcUZwr5wzeJFfS1fZQB0")' }}
        ></div>
      )}
    </div>
  );
};

export default Message; 