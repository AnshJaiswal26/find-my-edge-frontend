import React from "react";

export const FormulaValidation = ({ valid }) => (
  <div className="text-sm">
    {valid ? (
      <span className="text-green-600">✓ Valid expression</span>
    ) : (
      <span className="text-red-500">⚠ Invalid expression</span>
    )}
  </div>
);
