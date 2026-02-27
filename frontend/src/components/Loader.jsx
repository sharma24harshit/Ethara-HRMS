import React from 'react';

const Loader = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 20, md: 36, lg: 56 };
  const px = sizes[size] || sizes.md;

  return (
    <div className="loader-wrapper">
      <div
        className="loader-ring"
        style={{ width: px, height: px }}
        aria-label="Loading..."
        role="status"
      />
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;