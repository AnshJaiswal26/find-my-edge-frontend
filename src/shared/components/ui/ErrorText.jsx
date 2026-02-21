export default function ErrorText({ text = "" }) {
  return <div className="text-sm text-(--error) w-full text-left">{text}</div>;
}
