import Card from './Card';
import Dropdown from './Dropdown';

const CountrySelector = ({ country, onSelectCountry, onNext }) => {
  return (
    <Card title="Where Is Your Home Located?">
      <p className="text-gray-600 mb-6 text-center">
        We'll tailor electricity prices, installation costs, subsidies, and units to your country.
      </p>
      <Dropdown
        label="Country"
        name="country"
        options={[
          { label: "India", value: "India" },
          { label: "Sweden", value: "Sweden" }
        ]}
        value={country}
        onChange={onSelectCountry}
        helperText="You can't change this later in the wizard without starting over."
      />
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!country}
          className={`py-3 px-8 rounded-full text-white font-semibold text-lg transition-all duration-300 ${country ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          Continue →
        </button>
      </div>
    </Card>
  );
};

export default CountrySelector;
