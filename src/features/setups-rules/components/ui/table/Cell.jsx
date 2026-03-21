export const Cell = ({ text, index }) => {
  return (
    <div
      className={`text-(--text) text-left
      flex-1
      p-2 px-3 ${index === 0 ? "pl-0" : ""}
      text-ellipsis overflow-hidden
      whitespace-nowrap`}
    >
      {text}
    </div>
  );
};
