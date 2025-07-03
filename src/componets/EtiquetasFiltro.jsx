const EtiquetasFiltro = ({ etiquetas = [] }) => (
  <div className="w-full p-2 sm:p-4 flex flex-wrap gap-4 sm:gap-8">
    {etiquetas.map((texto, index) => (
      <div
        key={index}
        className="h-8 px-3 sm:px-4 pr-2 bg-[#EDEDED] rounded-[16px] flex items-center justify-center gap-1 sm:gap-2 hover:cursor-pointer hover:bg-black hover:text-white transition-colors duration-300"
      >
        <span className="text-xs sm:text-sm font-medium leading-[1.5] font-['Plus Jakarta Sans']">
          {texto}
        </span>
        <div className="w-6 h-6 sm:w-8 sm:h-8 relative overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8 p-1">
            <path fillRule="evenodd" d="M2.25 4.5A.75.75 0 0 1 3 3.75h14.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Zm0 4.5A.75.75 0 0 1 3 8.25h9.75a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 2.25 9Zm15-.75A.75.75 0 0 1 18 9v10.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V9a.75.75 0 0 1 .75-.75Zm-15 5.25a.75.75 0 0 1 .75-.75h9.75a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    ))}
  </div>
);

export default EtiquetasFiltro;
