import React from 'react';

function NFCStep({ stepNumber, description }) {
  return (
    <div className="p-3 sm:p-4">
      <h3 className="text-[#141414] text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] pb-2">
        Paso {stepNumber}
      </h3>
      <p className="text-gray-600 text-sm sm:text-base font-normal leading-normal">
        {description}
      </p>
    </div>
  );
}

export default NFCStep;