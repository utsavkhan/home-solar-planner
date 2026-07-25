const Header = ({ countryLabel, onLogoClick }) => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-teal-700 text-white p-4 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <h1
          onClick={onLogoClick}
          onKeyDown={(e) => {
            if (onLogoClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onLogoClick();
            }
          }}
          role={onLogoClick ? 'button' : undefined}
          tabIndex={onLogoClick ? 0 : undefined}
          aria-label={onLogoClick ? 'Go to homepage' : undefined}
          className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center flex-wrap ${onLogoClick ? 'cursor-pointer hover:opacity-90 transition-opacity duration-200' : ''}`}
        >
          ☀️ Home Solar Planner
          <span className="ml-1 px-1 py-1 text-xs font-semibold rounded-full uppercase leading-none"> {/* text-xs makes it small */}
            BETA
          </span>
        </h1>
        <span className="text-sm md:text-base opacity-90">
          {countryLabel ? `On-Grid Solar Plants for ${countryLabel} Homes` : "On-Grid Solar Plants for Homes"}
        </span>
      </div>
    </header>
  );
};

export default Header;