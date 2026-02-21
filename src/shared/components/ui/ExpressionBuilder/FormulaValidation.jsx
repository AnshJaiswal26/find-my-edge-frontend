export const FormulaValidation = ({ valid, error }) => (
  <div className="text-sm">
    {valid ? (
      <span className="text-green-600">✓ Valid expression</span>
    ) : (
      <span className="text-red-500">
        {error ? error : "⚠ Invalid expression"}
      </span>
    )}
  </div>
);
