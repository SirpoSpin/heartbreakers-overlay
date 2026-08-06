export default function ScoreBox({
  score,
  color,
  side
}: {
  score: number;
  color: string;
  side: "left" | "right";
}) {
  return (
    <div
      style={{
        padding: "10px 18px",
        background: color,
        border: "2px solid white",
        borderLeft: side === "left" ? "none" : "2px solid white",
        borderRight: side === "right" ? "none" : "2px solid white",
        borderTopLeftRadius: side === "left" ? "0" : "6px",
        borderBottomLeftRadius: side === "left" ? "0" : "6px",
        borderTopRightRadius: side === "right" ? "0" : "6px",
        borderBottomRightRadius: side === "right" ? "0" : "6px",
        fontSize: "28px",
        fontWeight: "bold"
        
      }}
    >
      {score}
    </div>
  );
}
