const SliderInput = ({ label, name, value, onChange, min, max, step, unit, helperText, disabled = false }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">
        {label}: <span className="font-normal text-green-700">{value}{unit}</span>
      </label>
      <input
        type="range"
        id={name}
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 disabled:opacity-50"
        disabled={disabled}
      />
      {helperText && <p className="text-gray-600 text-xs italic mt-1">{helperText}</p>}
    </div>
  );
};

export default SliderInput;