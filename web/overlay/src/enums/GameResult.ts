export const GameResult = {
  Unreported: "Unreported",
  Win: "Win",
  Loss: "Loss"
} as const;

export type GameResult = typeof GameResult[keyof typeof GameResult];
