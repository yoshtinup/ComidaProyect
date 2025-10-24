import React from 'react';

function AlertNotification({ type = "error", message, onClose }) {
  const colorMap = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" /></svg>
      )
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>
      )
    }
  };
  const style = colorMap[type] || colorMap.error;
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-fade-in">
      <div className={`flex items-center gap-3 p-4 rounded-lg border ${style.bg} ${style.border} shadow-lg`}>
        {style.icon}
        <span className={`flex-1 ${style.text} font-semibold`}>{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-2 px-2 py-1 text-xs rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600">Cerrar</button>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease;
        }
      `}</style>
    </div>
  );
}

export default AlertNotification;
