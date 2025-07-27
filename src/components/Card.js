const Card = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-gray-200">
      {title && (
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 text-center">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;