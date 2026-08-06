export default function CharacterBox({ label }: { label: string }) {
  return (
    <div
      style={{
        width: "70px",
        height: "70px",
        background: "#1e90ff",
        border: "3px solid white",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold"
      }}
    >
      {label}
    </div>
  );
}
