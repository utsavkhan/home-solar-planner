const FormInput = ({ label, type = 'text', name, value, onChange, unit, placeholder, helperText, min, max, step, disabled = false }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all duration-200">
        <input
          type={type}
          id={name}
          name={name}
          className="flex-grow py-2 px-3 text-gray-800 leading-tight focus:outline-none bg-transparent rounded-l-lg"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
        {unit && <span className="text-gray-500 text-sm pr-3">{unit}</span>}
      </div>
      {helperText && <p className="text-gray-600 text-xs italic mt-1">{helperText}</p>}
    </div>
  );
};

export default FormInput;