const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8 rounded-t-lg">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Home Solar Planner. All rights reserved.</p>
        <p className="mt-1 opacity-80">Estimates are for guidance only. Consult a professional for exact figures.</p>
      </div>
    </footer>
  );
};

export default Footer;