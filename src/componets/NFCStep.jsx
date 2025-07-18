import React from 'react';

function NFCStep({ stepNumber, description }) {
  return (
    <>
      <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Paso {stepNumber}
      </h3>
      <p className="text-[#141414] text-base font-normal leading-normal pb-3 pt-1 px-4">
        {description}
      </p>
    </>
  );
}

export default NFCStep;