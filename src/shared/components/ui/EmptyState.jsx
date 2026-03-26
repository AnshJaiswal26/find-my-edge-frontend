export const EmptyState = ({ text, className }) => (
  <div
    className={`flex items-center justify-center h-full text-(--text-muted) text-md ${className}`}
  >
    <span>{text}</span>
  </div>
);
