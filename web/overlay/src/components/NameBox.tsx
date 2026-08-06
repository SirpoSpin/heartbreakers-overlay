export default function NameBox({
  name,
  color,
  side
}: {
  name: string;
  color: string;
  side: "left" | "right";
}) {
  const isLeft = side === "left";
  const isRight = side === "right";

  return (
    <div
      style={{
        padding: "8px 16px",
        background: color,
        border: "2px solid white",

        // remove inner border for blending
        borderRight: isLeft ? "none" : "2px solid white",
        borderLeft: isRight ? "none" : "2px solid white",

        // outer corners only
        borderTopLeftRadius: isLeft ? "6px" : "0",
        borderBottomLeftRadius: isLeft ? "6px" : "0",
        borderTopRightRadius: isRight ? "6px" : "0",
        borderBottomRightRadius: isRight ? "6px" : "0",

        fontWeight: "bold",
        display: "flex",
        alignItems: "center",

        minWidth: "150px",
        width: "150px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
      }}
    >
      {name}
    </div>
  );
}
