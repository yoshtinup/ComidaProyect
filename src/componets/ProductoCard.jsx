import placeholderImg from '/snack_bag.jpg';

const ProductoCard = ({ id, nombre, precio, imagen, onAddToCart }) => {
  const handleImageError = (e) => {
    e.target.src = placeholderImg;
  };

  return (
    <div className="w-full max-w-xs bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="aspect-square w-full">
        <img 
          className="w-full h-full object-cover" 
          src={imagen} 
          alt={nombre}
          onError={handleImageError}
        />
      </div>
    <div className="p-4 space-y-3">
      <div className="space-y-1">
        <h3 className="text-neutral-900 text-sm sm:text-base font-semibold leading-tight line-clamp-2">{nombre}</h3>
        <p className="text-neutral-500 text-xs sm:text-sm font-normal leading-tight">{precio}</p>
      </div>
      <button
        className="w-full py-2.5 sm:py-3 px-4 bg-black hover:bg-gray-800 rounded-lg transition-colors duration-200 active:scale-95 transform"
        onClick={() => onAddToCart(id)}
      >
        <span className="text-white text-sm sm:text-base font-medium">Agregar al carrito</span>
      </button>
    </div>
  </div>
  );
};

export default ProductoCard;