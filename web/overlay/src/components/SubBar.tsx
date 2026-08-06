export default function SubBar({
  children,
  color,
  side
}: {
  children: React.ReactNode;
  color: string;
  side: "left" | "right";
}) {
  return (
    <div
      style={{
        marginTop: "-6px", // overlap upward
        padding: "4px 10px",
        background: color,
        border: "2px solid white",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center",
        position: "relative",
        zIndex: 2,

        // ⭐ offset depending on side
        marginLeft: side === "left" ? "12px" : "0",
        marginRight: side === "right" ? "12px" : "0"
      }}
    >
      {children}
    </div>
  );
}
