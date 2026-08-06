import { useEffect, useRef, useState } from "react";
import type { GameResult } from "../enums/GameResult";
import LogoBox from "../components/LogoBox";
import PronounBadge from "../components/PronounBadge";
import AngledText from "../components/AngledText";
import HeartBar from "../components/HeartBar";
import BracketLabel from "../components/BracketLabel";

type PlayerState = {
  name: string;
  pronouns: string;
  score: number;
  character: string;
  games: GameResult[];
};

type OverlayState = {
  player1: PlayerState;
  player2: PlayerState;
  bestOf: 3 | 5;
  bracketLevel: string;
  logoPosition: "left" | "center" | "right";
};

const defaultState: OverlayState = {
  player1: { name: "", pronouns: "", score: 0, character: "", games: [] },
  player2: { name: "", pronouns: "", score: 0, character: "", games: [] },
  bestOf: 3,
  bracketLevel: "",
  logoPosition: "center"
};

export default function OverlayMain() {
  const ws = useRef<WebSocket | null>(null);
  const [state, setState] = useState<OverlayState>(defaultState);

  const [introPlayed, setIntroPlayed] = useState(false);
  const [heartsVisible, setHeartsVisible] = useState(false);

  // WebSocket listener
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/ws");

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "scoreboard:update") {
        setState(data.payload);
      }
    };

    return () => ws.current?.close();
  }, []);

  // Initial fetch for latest state
  useEffect(() => {
    fetch("http://localhost:8080/getLatest")
      .then(res => res.json())
      .then(data => {
        if (data?.payload) {
          setState(data.payload);
        } else {
          setState(defaultState);
        }
        triggerIntroAnimation();
      });
  }, []);

  function triggerIntroAnimation() {
    setHeartsVisible(false);
    setIntroPlayed(true);

    setTimeout(() => {
      setHeartsVisible(true);
    }, 1000);
  }

  return (<>

    <div className={`logo-container`}>
      <div className={`${state.logoPosition}-logo ${introPlayed ? "fade-up" : ""}`}>
        <LogoBox />
      </div>
    </div>
    <div className={`overlay-root ${introPlayed ? "overlay-fade-in" : ""}`}>
      {/* WRAPPER FOR SCOREBOARD + BRACKET LABEL */}
      <div className="overlay-wrapper">
        {/* SCOREBOARD ROW */}
        <div className="overlay-container">

          {/* LEFT PLAYER */}
          <div className={`player-card left ${introPlayed ? "slide-in-left" : ""}`}>
            <div className="name-row">
              <AngledText text={state.player1.name} shadow="4px 4px 0px #FF3A8C" />
            </div>

            <div style={{ position: "relative" }}>
              <PronounBadge pronouns={state.player1.pronouns} side="right" />

              <div className={`heart-wrapper ${heartsVisible ? "hearts-in" : ""}`}>
                <HeartBar
                  score={state.player1.score}
                  games={state.player1.games}
                  side="left"
                  heartsVisible={heartsVisible}
                />
              </div>
            </div>
          </div>
          <div className="logo-spacer" />


          {/* RIGHT PLAYER */}
          <div className={`player-card right ${introPlayed ? "slide-in-right" : ""}`}>
            <div className="name-row">
              <AngledText text={state.player2.name} shadow="4px 4px 0px #4BC7FF" />
            </div>

            <div style={{ position: "relative" }}>
              <PronounBadge pronouns={state.player2.pronouns} side="left" />

              <div className={`heart-wrapper ${heartsVisible ? "hearts-in" : ""}`}>
                <HeartBar
                  score={state.player2.score}
                  games={state.player2.games}
                  side="right"
                  heartsVisible={heartsVisible}
                />
              </div>
            </div>
          </div>

        </div>

        {/* BRACKET LABEL BELOW EVERYTHING */}
        <BracketLabel text={state.bracketLevel} />

      </div>
    </div>
  </>
  );
}
