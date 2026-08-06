import { useState } from "react";
import { GameResult } from "./GameResult";
import SetListFetcher from "./components/SetListFetcher";

type PlayerState = {
  name: string;
  pronouns: string;
  score: number;
  character: string;
  games: GameResult[];
};

export default function App() {
  const [bestOf, setBestOf] = useState<3 | 5>(3);
  const [bracketLevel, setBracketLevel] = useState("");
  const [logoPosition, setLogoPosition] = useState<"left" | "right" | "center">("center");

  const initialGames = (size: number): GameResult[] =>
    Array(size).fill("Unreported");

  const [player1, setPlayer1] = useState<PlayerState>({
    name: "",
    pronouns: "",
    score: 0,
    character: "",
    games: initialGames(3)
  });

  const [player2, setPlayer2] = useState<PlayerState>({
    name: "",
    pronouns: "",
    score: 0,
    character: "",
    games: initialGames(3)
  });

  // ⭐ UPDATED: sendUpdate now includes bracketLevel
  function sendUpdate(customState?: { player1: PlayerState; player2: PlayerState }) {
    const msg = JSON.stringify({
      type: "scoreboard:update",
      payload: {
        player1: customState?.player1 || player1,
        player2: customState?.player2 || player2,
        bestOf,
        bracketLevel,
        logoPosition
      }
    });

    fetch("http://localhost:8080/broadcast?msg=" + encodeURIComponent(msg));
  }

  function handleLogoPositionChange(value: "left" | "right" | "center") {
    setLogoPosition(value);

    sendUpdate({ player1: player1, player2: player2 });
  }

  function handleBestOfChange(value: 3 | 5) {
    setBestOf(value);

    const size = value === 3 ? 3 : 5;

    const resetP1 = { ...player1, score: 0, games: initialGames(size) };
    const resetP2 = { ...player2, score: 0, games: initialGames(size) };

    setPlayer1(resetP1);
    setPlayer2(resetP2);

    sendUpdate({ player1: resetP1, player2: resetP2 });
  }

  function toggleCheckbox(player: 1 | 2, index: number) {
    if (index > 0) {
      const prevGameResolved =
        player1.games[index - 1] !== "Unreported" ||
        player2.games[index - 1] !== "Unreported";

      if (!prevGameResolved) return;
    }

    const p1 = [...player1.games];
    const p2 = [...player2.games];

    let becameUnreported = false;

    if (player === 1) {
      const current = p1[index];
      const opponent = p2[index];

      if (current === "Unreported" && opponent === "Unreported") {
        p1[index] = "Win";
        p2[index] = "Loss";
      } else if (current === "Win") {
        p1[index] = "Unreported";
        p2[index] = "Unreported";
        becameUnreported = true;
      } else if (opponent === "Win") {
        p2[index] = "Loss";
        p1[index] = "Win";
      }

    } else {
      const current = p2[index];
      const opponent = p1[index];

      if (current === "Unreported" && opponent === "Unreported") {
        p2[index] = "Win";
        p1[index] = "Loss";
      } else if (current === "Win") {
        p2[index] = "Unreported";
        p1[index] = "Unreported";
        becameUnreported = true;
      } else if (opponent === "Win") {
        p1[index] = "Loss";
        p2[index] = "Win";
      }
    }

    if (becameUnreported) {
      for (let i = index + 1; i < p1.length; i++) {
        p1[i] = "Unreported";
        p2[i] = "Unreported";
      }
    }

    const updatedP1 = {
      ...player1,
      games: p1,
      score: p1.filter(g => g === "Win").length
    };

    const updatedP2 = {
      ...player2,
      games: p2,
      score: p2.filter(g => g === "Win").length
    };

    setPlayer1(updatedP1);
    setPlayer2(updatedP2);

    sendUpdate({ player1: updatedP1, player2: updatedP2 });
  }

  function swapPlayers() {
    const swapped = {
      player1: player2,
      player2: player1
    };

    setPlayer1(swapped.player1);
    setPlayer2(swapped.player2);

    sendUpdate(swapped);
  }

  function resetScores() {
    const size = bestOf === 3 ? 3 : 5;

    const resetP1 = { ...player1, score: 0, games: initialGames(size) };
    const resetP2 = { ...player2, score: 0, games: initialGames(size) };

    setPlayer1(resetP1);
    setPlayer2(resetP2);

    sendUpdate({ player1: resetP1, player2: resetP2 });
  }

  function resetAll() {
    const size = bestOf === 3 ? 3 : 5;

    const resetP1 = {
      name: "",
      pronouns: "",
      score: 0,
      character: "",
      games: initialGames(size)
    };

    const resetP2 = {
      name: "",
      pronouns: "",
      score: 0,
      character: "",
      games: initialGames(size)
    };

    setPlayer1(resetP1);
    setPlayer2(resetP2);

    sendUpdate({ player1: resetP1, player2: resetP2 });
  }

  function loadSetIntoPlayers(set: any) {
    const p1 = set.slots[0]?.entrant?.name || "";
    const p2 = set.slots[1]?.entrant?.name || "";

    setPlayer1(prev => ({ ...prev, name: p1 }));
    setPlayer2(prev => ({ ...prev, name: p2 }));

    setBracketLevel(set.fullRoundText || "");
  }

  // Shared input style
  const inputStyle: React.CSSProperties = {
    width: "200px",
    alignSelf: "center",
    textAlign: "center",
    padding: "4px"
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Scoreboard Control Panel</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Logo Position: </label>
        <select
          value={logoPosition}
          onChange={(e) => handleLogoPositionChange(e.target.value as "left" | "center" | "right")}
        >
          <option value={"left"}>Left</option>
          <option value={"center"}>Center</option>
          <option value={"right"}>Right</option>
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Match Format: </label>
        <select
          value={bestOf}
          onChange={(e) => handleBestOfChange(Number(e.target.value) as 3 | 5)}
        >
          <option value={3}>Best of 3</option>
          <option value={5}>Best of 5</option>
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Bracket Level: </label>
        <input
          type="text"
          placeholder="e.g. Winners Quarterfinals"
          value={bracketLevel}
          onChange={(e) => setBracketLevel(e.target.value)}
          style={{ width: "200px", marginLeft: 10 }}
        />
      </div>

      {/* Swap Button */}
      <button onClick={swapPlayers} style={{ marginBottom: 10 }}>
        Swap Players
      </button>

      {/* Reset Buttons */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={resetScores} style={{ marginRight: 10 }}>
          Reset Scores
        </button>
        <button onClick={resetAll}>
          Reset Everything
        </button>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "40px",
          alignItems: "flex-start"
        }}
      >
        {/* Player 1 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2>Player 1</h2>

          <input
            placeholder="Name"
            value={player1.name}
            onChange={(e) => setPlayer1({ ...player1, name: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Pronouns"
            value={player1.pronouns}
            onChange={(e) => setPlayer1({ ...player1, pronouns: e.target.value })}
            style={{ ...inputStyle, marginTop: 4 }}
          />

          <div style={{ marginTop: 8, marginBottom: 5 }}>
            <strong>Score: {player1.score}</strong>
          </div>

          <input
            placeholder="Character URL"
            value={player1.character}
            onChange={(e) =>
              setPlayer1({ ...player1, character: e.target.value })
            }
            style={inputStyle}
          />

          <div style={{ marginTop: 10 }}>
            {player1.games.map((result, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <strong>Game {i + 1}: </strong>
                <input
                  type="checkbox"
                  checked={result === "Win"}
                  onChange={() => toggleCheckbox(1, i)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Player 2 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2>Player 2</h2>

          <input
            placeholder="Name"
            value={player2.name}
            onChange={(e) => setPlayer2({ ...player2, name: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Pronouns"
            value={player2.pronouns}
            onChange={(e) => setPlayer2({ ...player2, pronouns: e.target.value })}
            style={{ ...inputStyle, marginTop: 4 }}
          />

          <div style={{ marginTop: 8, marginBottom: 5 }}>
            <strong>Score: {player2.score}</strong>
          </div>

          <input
            placeholder="Character URL"
            value={player2.character}
            onChange={(e) =>
              setPlayer2({ ...player2, character: e.target.value })
            }
            style={inputStyle}
          />

          <div style={{ marginTop: 10 }}>
            {player2.games.map((result, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <strong>Game {i + 1}: </strong>
                <input
                  type="checkbox"
                  checked={result === "Win"}
                  onChange={() => toggleCheckbox(2, i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => sendUpdate()} style={{ marginTop: 20 }}>
        Update Overlay
      </button>

      <SetListFetcher onSelectSet={loadSetIntoPlayers} />
    </div>
  );
}
