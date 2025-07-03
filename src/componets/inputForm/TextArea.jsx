// components/TextArea.jsx
const TextArea = ({ id, label, placeholder, required = true, ...rest }) => {
  return (
    <div >
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        required={required}
        placeholder={placeholder}
        className="w-full min-h-36 p-3 bg-neutral-50 rounded-xl border border-zinc-300 resize-none"
        {...rest}
      />
    </div>
  );
};

export default TextArea;
