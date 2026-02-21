export default function SuccessText({ text = "" }) {
  return (
    <div className="text-sm text-(--success) w-full text-left">{text}</div>
  );
}
