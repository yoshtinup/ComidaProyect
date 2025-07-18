import React from 'react';
import Header from '../componets/Header';
import BodyNFC from '../organismo/BodyNFC';
function NFCReference() {
  return (
    <div 
      className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden" 
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header></Header>
        <BodyNFC />
      </div>
    </div>
  );
}

export default NFCReference;