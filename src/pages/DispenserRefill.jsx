import React, { useEffect, useState } from "react";
import HeaderAdmin from "../componets/HeaderAdmin";
import Buttom from "../componets/bottom/Buttom";
import Input from "../componets/inputForm/Input";
import config from "../config/apiConfig";

const categories = [
  { key: "chocolates", label: "Apartado 1" },
  { key: "papas", label: "Apartado 2" },
  { key: "gomitas", label: "Apartado 3" },
];

function DispenserRefill() {
  const [dispensers, setDispensers] = useState([]);
  const [selectedDispenser, setSelectedDispenser] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedProductBySection, setSelectedProductBySection] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(config.endpoints.dispenserList)
      .then((res) => res.json())
      .then((data) => {
        setDispensers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedDispenser) return;
    setLoading(true);
    fetch(config.endpoints.productos)
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedDispenser]);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const handleProductSelect = (sectionKey, productId) => {
    setSelectedProductBySection((prev) => ({ ...prev, [sectionKey]: productId }));
  };

  const handleConfirm = () => {
    // Validar cantidades
    let error = false;
    categories.forEach((cat) => {
      const prodId = selectedProductBySection[cat.key];
      if (prodId) {
        const producto = allProducts.find((p) => p.id === prodId);
        const cantidadDisponible = producto?.cantidad ?? 0;
        const cantidadUsuario = parseInt(quantities[prodId], 10);
        if (cantidadUsuario > cantidadDisponible) {
          error = true;
        }
      }
    });
    if (error) {
      alert("La cantidad a añadir no puede ser mayor a la cantidad disponible.");
      return;
    }
    // Aquí puedes hacer la petición para actualizar el inventario
    alert("Rellenado confirmado (simulado)");
  };

  return (
    <>
      <HeaderAdmin />
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50">
        <div className="w-full px-12 py-8 flex flex-col items-center">
          <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight mb-2 text-left">
            Rellenar dispensador
          </p>
          <p className="text-neutral-500 text-sm font-normal leading-normal mb-6 text-left">
            Selecciona un dispensador y añade productos a su inventario por categoría.
          </p>
          <div className="flex flex-wrap items-end gap-4 px-4 py-3 w-full" style={{maxWidth: '100vw', margin: '0 auto'}}>
            <label className="flex flex-col min-w-40 flex-1">
              <select
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border border-[#dbdbdb] bg-neutral-50 focus:border-[#dbdbdb] h-14 p-[15px] text-base font-normal leading-normal"
                value={selectedDispenser}
                onChange={(e) => setSelectedDispenser(e.target.value)}
              >
                <option value="">Selecciona un dispensador</option>
                {dispensers.map((d) => (
                  <option key={d.dispenser_id} value={d.dispenser_id}>{d.location}</option>
                ))}
              </select>
            </label>
          </div>
          <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-left">Categorías de Productos</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Cargando...</div>
          ) : selectedDispenser ? (
            <div className="w-full flex flex-col items-center">
              {categories.map((cat) => (
                <div key={cat.key} className="w-full">
                  <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 text-left">{cat.label}</h3>
                  <div className="px-0 py-3">
                    <div className="flex w-full" style={{maxWidth: '100vw', margin: '0 auto'}}>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-neutral-50">
                            <th className="px-4 py-3 text-left text-[#141414] text-sm font-medium leading-normal">Producto</th>
                            <th className="px-4 py-3 text-left text-[#141414] text-sm font-medium leading-normal">Cantidad Disponible</th>
                            <th className="px-4 py-3 text-left text-[#141414] text-sm font-medium leading-normal">Cantidad a Añadir</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allProducts.map((prod) => (
                            <tr key={prod.id} className="border-t border-t-[#dbdbdb]">
                              <td className="h-[72px] px-4 py-2 text-[#141414] text-sm font-normal leading-normal">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`select_${cat.key}`}
                                    checked={selectedProductBySection[cat.key] === prod.id}
                                    onChange={() => handleProductSelect(cat.key, prod.id)}
                                  />
                                  {prod.nombre}
                                </label>
                              </td>
                              <td className="h-[72px] px-4 py-2 text-neutral-500 text-sm font-normal leading-normal">{prod.cantidad}</td>
                              <td className="h-[72px] px-4 py-2 text-neutral-500 text-sm font-bold leading-normal tracking-[0.015em]">
                                {selectedProductBySection[cat.key] === prod.id && (
                                  <Input.Input1
                                    name={`cantidad_${prod.id}`}
                                    type="number"
                                    contexto={"Cantidad"}
                                    value={quantities[prod.id] || ""}
                                    onChange={(e) => handleQuantityChange(prod.id, e.target.value)}
                                    min={0}
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex px-4 py-3 justify-end w-full" style={{maxWidth: '100vw', margin: '0 auto'}}>
                <Buttom.Buttom1
                  contexto="Confirmar Rellenado"
                  type="button"
                  large="w-1/2"
                  onClick={handleConfirm}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default DispenserRefill;
