const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-teal-700 text-white p-4 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center">
          ☀️ Home Solar Planner
          <span className="ml-1 px-1 py-1 text-xs font-semibold rounded-full uppercase leading-none"> {/* text-xs makes it small */}
            BETA
          </span>
        </h1>
        <span className="text-sm md:text-base opacity-90">
          On-Grid Solar Plants for Indian Homes
        </span>
      </div>
    </header>
  );
};

export default Header;