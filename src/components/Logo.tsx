const Logo = () => {
  return (
    <div className="flex justify-center items-center mb-6">
      <div className="w-32 h-32 relative">
        <img
          src="/ecg-logo.png"
          alt="ECG Logo"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Logo; 