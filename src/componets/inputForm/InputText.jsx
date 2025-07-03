// components/InputText.jsx
const InputText = ({ id, label, type = "text", placeholder, required = true, step, ...rest }) => {
  return (
    <div >
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        step={step}
        required={required}
        placeholder={placeholder}
        className="w-full h-10 p-3 bg-neutral-50 rounded-xl border border-zinc-300"
        {...rest}
      />
    </div>
  );
};

export default InputText;
