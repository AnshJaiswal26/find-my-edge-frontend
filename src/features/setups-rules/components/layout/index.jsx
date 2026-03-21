export const ToolbarSection = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-row items-center gap-2 h-full ${className}`}>
      {children}
    </div>
  );
};
