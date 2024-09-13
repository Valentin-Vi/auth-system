import React from 'react';

function Error() {
  return (
    <div className='flex flex-col items-center w-full pt-10 pb-10'>
        <span className="text-x text-black font-bold text-center mb-2">
            Error
        </span>
        <label className="text-sm text-gray-600 text-center mb-2">
            Could not load requested page
        </label>
        <span className="text-xs text-gray-400 italic">
            404 Not Found...
        </span>
    </div>
  );
};

export default Error;