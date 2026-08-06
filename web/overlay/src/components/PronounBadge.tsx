export default function PronounBadge({
  pronouns,
  side
}: {
  pronouns: string;
  side: "left" | "right";
}) {
  if (!pronouns || pronouns.trim() === "") return null;

  const positionStyle =
    side === "left"
      ? { left: "-10px" }   // badge on the left for right-side hearts
      : { right: "10px" }; // badge on the right for left-side hearts

  return (
    <div
      style={{
        position: "absolute",
        top: "120%",
        transform: "translateY(-50%)",
        padding: "4px 4px",
        borderRadius: "999px",
        background: "black",
        color: "white",
        fontWeight: "bold",
        fontSize: "8px",
        whiteSpace: "nowrap",
        zIndex: 5,
        ...positionStyle
      }}
    >
      {pronouns.toLocaleLowerCase()}
    </div>
  );
}
