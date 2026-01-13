export function highlightMatch(text, query) {
  if (!query) {
    return { before: text, match: "", after: "" };
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) {
    return { before: text, match: "", after: "" };
  }

  return {
    before: text.slice(0, index),
    match: text.slice(index, index + query.length),
    after: text.slice(index + query.length),
  };
}
