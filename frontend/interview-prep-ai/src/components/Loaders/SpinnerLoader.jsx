import React from 'react';

const SpinnerLoader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default SpinnerLoader;
