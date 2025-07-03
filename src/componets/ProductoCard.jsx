const ProductoCard = ({ id, nombre, precio, imagen, onAddToCart }) => (
  <div className="w-56 h-80 relative">
    <img className="w-56 h-56 absolute left-[4px] top-0 rounded-[10px]" src={imagen} alt={nombre} />
    <div className="absolute top-[237px] left-[3px] inline-flex flex-col items-start w-56">
      <div className="text-neutral-900 text-base font-medium leading-normal">{nombre}</div>
      <div className="text-neutral-500 text-sm font-normal leading-tight">{precio}</div>
    </div>
    <div
      className="absolute top-[286px] left-0 w-56 h-12 px-5 bg-black rounded inline-flex justify-center items-center overflow-hidden cursor-pointer"
      onClick={() => onAddToCart(id)}
    >
      <div className="text-neutral-50 text-base font-bold leading-normal">Agregar al carrito</div>
    </div>
  </div>
);
export default ProductoCard;