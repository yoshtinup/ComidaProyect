const Input1 = ({name, type, contexto, value, onChange}) => {
  return (
    <div className='mb-5 text-left'>
        <label className="hidden">{name}</label>
        <input
        type={type}
        placeholder={contexto}
        value={value}
        onChange={onChange}
        className="w-[100%] p-4 border border-gray-200 rounded-lg mt-2 text-sm bg-gray-50"
        required
        />
    </div>
  );
};
const Input2 = () => {
  return (
    <div className="flex min-h-screen font-[Arial]">

    </div>
  );
};
const Input = {
  Input1,
  Input2
}
export default Input;