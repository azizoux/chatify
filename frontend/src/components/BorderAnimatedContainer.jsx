const BorderAnimatedContainer = ({ children }) => {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden flex animate-border border-animated">
      {children}
    </div>
  );
};

export default BorderAnimatedContainer;
