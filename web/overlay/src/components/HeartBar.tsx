import { useEffect, useState } from "react";
import Heart from "../images/heart.svg";
import BrokenHeart from "../images/brokenheart.svg";
import { GameResult } from "../enums/GameResult";

export default function HeartBar({
  games,
  score,
  side,
  heartsVisible
}: {
  games: GameResult[];
  score: number;
  side: "left" | "right";
  heartsVisible: boolean;
}) {

  // Flip order for left side (visual order)
  const ordered = side === "left" ? [...games].reverse() : games;

  const barColor = side === "left" ? "#FF3A8C" : "#4BC7FF";

  // Score badge alignment
  const scoreSideStyle =
    side === "left"
      ? { left: "-25px" }
      : { right: "-28px" };

  // ⭐ Determine pop order:
  const popIndex = (i: number) =>
    side === "left"
      ? ordered.length - 1 - i
      : i;

  // ⭐ Heartbeat animation trigger for score badge
  const [scoreBeat, setScoreBeat] = useState(false);

  useEffect(() => {
    // Trigger heartbeat animation
    setScoreBeat(true);

    // Remove class after animation finishes (300ms)
    const timeout = setTimeout(() => setScoreBeat(false), 300);

    return () => clearTimeout(timeout);
  }, [score]); // runs every time score changes

  return (
    <div
      style={{
        position: "relative",
        width: "200px",
        padding: "4px 0",
        marginTop: "-2px",
        marginRight: side === "left" ? "-8px" : "0",
        marginLeft: side === "right" ? "-8px" : "0",
      }}
    >
      {/* Background angled bar */}
      <div className="scrolling-bg"
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: "5px",
          background: barColor,
          transform: "skewX(-20deg) translateY(-50%)",
          opacity: 0.9,
          borderRadius: "2px",
          zIndex: 0
        }}
      />

      {/* ⭐ SCORE BADGE */}
      <div
        className={scoreBeat ? "score-beat" : ""}
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: "black",
          color: "white",
          fontWeight: "bold",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
          ...scoreSideStyle
        }}
      >
        {score}
      </div>

      {/* Hearts */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          justifyContent: side === "left" ? "flex-end" : "flex-start",
          position: "relative",
          zIndex: 2,
          marginRight: side === "left" ? "8px" : "0",
          marginLeft: side === "right" ? "8px" : "0",
        }}
      >
        {heartsVisible && ordered.map((result, i) => {

          if (result === "Unreported") {
            return (
              <div key={i} style={{ width: "22px", height: "22px" }} />
            );
          }

          const isWin = result === "Win";

          return (
            <div
              key={i}
              className="heart-pop"
              style={{
                animationDelay: `${popIndex(i) * 120}ms`
              }}
            >
              <img
                src={isWin ? Heart : BrokenHeart}
                className={isWin ? "heart alive" : "heart dead"}
                style={{
                  width: "22px",
                  height: "22px",
                  transition: "0.25s ease",
                  filter: isWin
                    ? "brightness(0) invert(1) drop-shadow(0 0 1px black) drop-shadow(0 0 1px black)"
                    : "brightness(0) drop-shadow(0 0 1px white) drop-shadow(0 0 1px white)"
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
