import React, { useState } from 'react';
import axios from 'axios';
import NFCStep from '../componets/NFCStep';
import Input from '../componets/inputForm/Input';
import AlertNotification from '../componets/modal/AlertNotification';
import config from '../config/apiConfig';

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

  const nfcFromStorage = localStorage.getItem('nfc') || "";
  const [nfcValue, setNfcValue] = useState("");
  const [editing, setEditing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [currentNfc, setCurrentNfc] = useState(nfcFromStorage);
  const handleNfcSend = async () => {
    if (!nfcValue.trim()) {
      setAlert({ type: "warning", message: "Por favor ingresa tu referencia NFC antes de enviar." });
      return;
    }
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId) {
      setAlert({ type: "error", message: "No se encontró el usuario. Inicia sesión nuevamente." });
      return;
    }
    if (!token) {
      setAlert({ type: "error", message: "No se encontró el token de autenticación. Inicia sesión nuevamente." });
      return;
    }
    try {
      const response = await axios.put(
        config.endpoints.userUpdateNfc(userId),
        { nfc: nfcValue },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAlert({ type: "warning", message: "Referencia NFC enviada correctamente." });
      setEditing(false);
      // Actualizar el NFC con el valor del response y guardarlo en localStorage
      const newNfc = response.data.updatedClient.nfc;
      setCurrentNfc(newNfc);
      localStorage.setItem('nfc', newNfc);
    } catch (err) {
      setAlert({ type: "error", message: "Error al enviar la referencia NFC. Intenta de nuevo." });
    }
  };

  const handleEdit = () => {
    setNfcValue(currentNfc);
    setEditing(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-20 flex flex-1 justify-center py-3 sm:py-5">
      <div className="layout-content-container flex flex-col lg:flex-row w-full max-w-6xl py-3 sm:py-5 flex-1 gap-6 lg:gap-8 items-start">
        {/* Imagen a la izquierda */}
        <div className="flex flex-col items-center justify-center w-full lg:w-1/3 order-1 lg:order-1">
          {alert && (
            <AlertNotification type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          )}
          <div className="w-48 h-48 sm:w-56 sm:h-56 bg-center bg-no-repeat bg-cover rounded-xl mb-4 sm:mb-6" style={{ backgroundImage: `url("${nfcImageUrl}")` }}></div>
          {currentNfc && !editing ? (
            <>
              <div className="mb-4 p-3 sm:p-4 bg-gray-100 rounded-lg w-full max-w-sm text-center">
                <span className="font-bold text-gray-700 text-sm sm:text-base">Referencia NFC actual:</span>
                <div className="mt-2 text-gray-900 text-base sm:text-lg font-mono break-all">{currentNfc}</div>
              </div>
              <button
                className="mt-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm sm:text-base w-full max-w-sm"
                onClick={handleEdit}
              >
                Editar
              </button>
            </>
          ) : (
            <div className="w-full max-w-sm">
              <Input.Input1
                name="nfc"
                type="text"
                contexto="Ingresa tu referencia NFC"
                value={nfcValue}
                onChange={e => setNfcValue(e.target.value)}
                placeholder="Referencia NFC"
              />
              <button
                className="mt-4 px-4 sm:px-6 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors text-sm sm:text-base w-full"
                onClick={handleNfcSend}
              >
                {currentNfc ? "Guardar cambios" : "Enviar NFC"}
              </button>
            </div>
          )}
        </div>
        {/* Pasos a la derecha */}
        <div className="flex flex-col w-full lg:w-2/3 order-2 lg:order-2">
          <h2 className="text-[#141414] tracking-light text-xl sm:text-2xl lg:text-[28px] font-bold leading-tight px-2 sm:px-4 pb-2 sm:pb-3 pt-3 sm:pt-5 text-center lg:text-left">
            ¿Cómo generar tu referencia NFC?
          </h2>
          <p className="text-[#141414] text-sm sm:text-base font-normal leading-normal pb-2 sm:pb-3 pt-1 px-2 sm:px-4 text-center lg:text-left">
            Sigue estos pasos para generar tu referencia NFC y recoger tu pedido en el dispensador.
          </p>
          <div className="flex flex-col gap-2 mt-2 px-2 sm:px-0">
            {steps.map((step) => (
              <NFCStep 
                key={step.number}
                stepNumber={step.number}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BodyNFC;