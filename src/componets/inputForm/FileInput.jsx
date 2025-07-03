// components/FileInput.jsx
const FileInput = ({ id = "imagen", label = "Cargar Imagen", onChange, previewUrl }) => {
  return (
    <div className="self-stretch p-4 w-full">
      <div className="w-full px-6 py-14 rounded-xl outline outline-2 outline-offset-[-2px] outline-zinc-300 flex flex-col items-center gap-6">
        <div className="max-w-[480px] text-center">
          <div className="text-neutral-900 text-lg font-bold">{label}</div>
          <div className="text-neutral-900 text-sm">
            Arrastra y suelta una imagen aquí, o haz clic para seleccionar un archivo.
          </div>
        </div>
        <label className="cursor-pointer">
          <div className="h-10 px-4 bg-gray-200 rounded-[20px] flex justify-center items-center">
            <div className="text-neutral-900 text-sm font-bold">Seleccionar Archivo</div>
          </div>
          <input
            type="file"
            id={id}
            name={id}
            accept="image/*"
            required
            onChange={onChange}
            className="hidden"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Vista previa"
              className="mt-4 w-32 h-32 object-cover rounded max-h-48 border"
            />
          )}
        </label>
      </div>
    </div>
  );
};

export default FileInput;
