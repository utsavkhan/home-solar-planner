const RadioGroup = ({ label, name, options, selectedValue, onChange, helperText, disabled = false }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>}
      <div className="flex flex-wrap gap-4">
        {options.map(option => (
          <label key={option.value} className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="form-radio h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
              disabled={disabled}
            />
            <span className="ml-2 text-gray-800 text-sm">{option.label}</span>
          </label>
        ))}
      </div>
      {helperText && <p className="text-gray-600 text-xs italic mt-1">{helperText}</p>}
    </div>
  );
};