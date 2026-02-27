import React from 'react';

const sizeMap = { sm: 'w-5 h-5 border-2', md: 'w-9 h-9 border-[3px]', lg: 'w-14 h-14 border-4' };

const Loader = ({ size = 'md', text = '' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-10">
    <div
      className={`${sizeMap[size] || sizeMap.md} border-elevated border-t-accent rounded-full animate-spin`}
      aria-label="Loading..."
      role="status"
    />
    {text && <p className="text-sm text-t3">{text}</p>}
  </div>
);

export default Loader;