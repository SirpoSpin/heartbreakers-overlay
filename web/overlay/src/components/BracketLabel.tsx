export default function BracketLabel({ text }: { text: string }) {
  if (!text)
    return;
  return (
    <div className="bracket-label-wrapper">
      <div className="bracket-label-box scrolling-bg">
        <div className="bracket-label-text">{text}</div>
      </div>
    </div>
  );
}
