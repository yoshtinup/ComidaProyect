const ScrollVertical = ({ children }) => {
  return (
    <div className="max-h-[70vh] overflow-y-auto w-full px-4 py-2 bg-white rounded shadow-sm">
      {children}
    </div>
  );
};

export default ScrollVertical;
