const ProductoBar = ({ nombre, width }) => (
  <div className="w-full flex items-center gap-2 sm:gap-4">
    <div className="w-20 sm:w-28 text-neutral-500 text-xs font-bold truncate">{nombre}</div>
    <div className="flex-1">
      <div className={`h-4 rounded bg-gray-200 border-r-2 border-neutral-500 ${width} max-w-full`} />
    </div>
  </div>
);

const TopProductos = ({ data }) => (
  <div className="p-2 sm:p-4">
    <div className="text-neutral-900 text-base font-medium mb-1">Ventas por Producto</div>
    <div className="text-neutral-900 text-2xl sm:text-3xl font-bold mb-1">$12,500</div>
    <div className="flex gap-1 mb-4">
      <span className="text-neutral-500 text-base">Este Mes</span>
      <span className="text-green-700 text-base font-medium">+12%</span>
    </div>
    <div className="flex flex-col gap-2 sm:gap-4">
      {data.map((producto, idx) => (
        <ProductoBar key={idx} nombre={producto.nombre} width={producto.width} />
      ))}
    </div>
  </div>
);

export default TopProductos;
