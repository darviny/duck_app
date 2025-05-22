import React from 'react';

interface RubricItem {
  title: string;
  description: string;
  score: number;
}

const Sidebar: React.FC = () => {
  const rubricItems: RubricItem[] = [
    {
      title: 'Clarity',
      description: 'Clear and concise explanation of the concept.',
      score: 80
    },
    {
      title: 'Accuracy',
      description: 'Accurate use of terminology and definitions.',
      score: 70
    },
    {
      title: 'Engagement',
      description: 'Engaging and interactive explanation.',
      score: 50
    }
  ];

  return (
    <div className="layout-content-container flex flex-col w-[360px]">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between">
          <p className="text-[#0d141c] text-base font-medium leading-normal">Confidence</p>
          <p className="text-[#0d141c] text-sm font-normal leading-normal">60%</p>
        </div>
        <div className="rounded bg-[#cedbe8]">
          <div className="h-2 rounded bg-[#0c7ff2]" style={{ width: '60%' }}></div>
        </div>
      </div>
      <h3 className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Rubric</h3>
      {rubricItems.map((item, index) => (
        <div key={index} className="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2 justify-between">
          <div className="flex flex-col justify-center">
            <p className="text-[#0d141c] text-base font-medium leading-normal line-clamp-1">{item.title}</p>
            <p className="text-[#49739c] text-sm font-normal leading-normal line-clamp-2">{item.description}</p>
          </div>
          <div className="shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-[88px] overflow-hidden rounded-sm bg-[#cedbe8]">
                <div className="h-1 rounded-full bg-[#0c7ff2]" style={{ width: `${item.score}%` }}></div>
              </div>
              <p className="text-[#0d141c] text-sm font-medium leading-normal">{item.score}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar; 