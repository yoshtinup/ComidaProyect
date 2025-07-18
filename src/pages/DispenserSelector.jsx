import React, { useEffect, useState } from "react";
import Header from "../../src/componets/Header.jsx";
import { useNavigate } from "react-router-dom";
function DispenserSelector({ onSelect }) {
  const navigate = useNavigate();
  const [dispensers, setDispensers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3002/api/v1/dispenser/")
      .then((res) => res.json())
      .then((data) => {
        setDispensers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (id) => {
    setSelected(id);
    localStorage.setItem("selectedDispenserId", id);
    if (onSelect) onSelect(id);
  };

  const handleConfirm = () => {
    if (onSelect) onSelect(selected);
    navigate("/home");
  };

  const filteredDispensers = dispensers.filter((d) =>
    d.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <Header />
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-neutral-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight mb-6 text-center">
          Selecciona tu dispensador de snacks
        </p>
        <div className="w-full flex flex-col items-center">
          <label className="flex flex-col min-w-40 h-12 mb-4 w-full max-w-md">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-neutral-500 flex border-none bg-neutral-50 items-center justify-center pl-4 rounded-l-xl border-r-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
              </div>
              <input
                placeholder="Buscar dispensador"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-neutral-50 focus:border-none h-full placeholder:text-neutral-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </label>
          <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 w-full text-center">Dispensadores Cercanos</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Cargando dispensadores...</div>
          ) : filteredDispensers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No se encontraron dispensadores.</div>
          ) : (
            <div className="w-full flex flex-col gap-2 items-center">
              {filteredDispensers.map((disp) => (
                <div
                  key={disp.dispenser_id}
                  className={`flex items-center gap-4 bg-neutral-50 px-4 min-h-[72px] py-2 rounded-lg border w-full max-w-md transition-all duration-150 ${selected === disp.dispenser_id ? "border-blue-500 bg-blue-50" : "border-transparent"}`}
                  onClick={() => handleSelect(disp.dispenser_id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">{disp.location}</p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">Disponibilidad: {disp.status === 'online' ? 'Alta' : 'Baja'}</p>
                  </div>
                  {selected === disp.dispenser_id && (
                    <span className="ml-auto text-blue-600 font-bold">Seleccionado</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex px-4 py-3 justify-center w-full">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-black text-neutral-50 text-base font-bold leading-normal tracking-[0.015em]"
              disabled={!selected}
              onClick={handleConfirm}
            >
              <span className="truncate">Confirmar Selección</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );

}

export default DispenserSelector;
