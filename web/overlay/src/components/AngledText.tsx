export default function AngledText({
  text,
  shadow,
  angle = -4,
  rotate = -3
}: {
  text: string;
  shadow: string;
  angle?: number;
  rotate?: number;
}) {
  const shadowColor = shadow.split(" ").pop() || "black";

  // ⭐ Dynamic font size based on text length
  const baseSize = 22;
  const minSize = 8;
  const shrinkRate = 0.5; // how aggressively it shrinks
  const fontSize = Math.max(minSize, baseSize - text.length * shrinkRate);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        padding: "4px",
        textAlign: "center",
        width: "200px",
        minHeight: "25px"
      }}
    >
      {/* Background angled bar */}
      {rotate !== 0 && <div className="scrolling-bg"
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: "12px",
          background: shadowColor,
          transform: "skewX(-20deg) translateY(-50%)",
          zIndex: 0,
          opacity: 0.9,
          borderRadius: "2px"
        }}
      />}

      {/* Foreground text */}
      <div
        style={{
          marginTop: "-6px",
          fontSize: `${fontSize}px`,
          fontWeight: 900,
          color: "black",
          textTransform: "uppercase",

          transform: `skewX(${angle}deg) rotate(${rotate}deg)`,

          WebkitTextStroke: "3px white",
          filter: `drop-shadow(${shadow})`,
          paintOrder: "stroke fill",

          position: "relative",
          zIndex: 2,
          whiteSpace: "nowrap"
        }}
      >
        {text}
      </div>
    </div>
  );
}
