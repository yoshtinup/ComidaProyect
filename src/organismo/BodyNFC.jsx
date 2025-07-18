import React from 'react';
import NFCStep from '../componets/NFCStep';

function BodyNFC() {
  const nfcImageUrl = "https://cdn.dribbble.com/userupload/26921860/file/original-b5e456e457a906d11dce267c43c2756c.gif";
  
  const steps = [
    {
      number: 1,
      description: "Acércate a nuestro dispensador tienda CineSnacks ubicada en el lobby del cine."
    },
    {
      number: 2,
      description: "Acerca tu tarjeta que incluya NFC o pagos por aproximacion en el scanner del dispensador."
    },
    {
      number: 3,
      description: "¡Ya estás listo para hacer tu nuevo pedido! Usa tu tarjeta casual para recoger tus pedidos ahora."
    }
  ];

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
        <h2 className="text-[#141414] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          ¿Cómo generar tu referencia NFC?
        </h2>
        <p className="text-[#141414] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
          Sigue estos pasos para generar tu referencia NFC y recoger tu pedido en el dispensador.
        </p>
        
        <div className="flex w-full grow bg-neutral-50 @container p-4">
          <div className="w-full gap-1 overflow-hidden bg-neutral-50 @[480px]:gap-2 aspect-[2/3] rounded-xl flex">
            <div
              className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
              style={{ backgroundImage: `url("${nfcImageUrl}")` }}
            ></div>
          </div>
        </div>
        
        {steps.map((step) => (
          <NFCStep 
            key={step.number}
            stepNumber={step.number}
            description={step.description}
          />
        ))}
      </div>
    </div>
  );
}

export default BodyNFC;