const RANK_NAMES = [
  "ROOKIE",
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "DIAMOND",
];

export const RANK_OPTIONS = [
  ...RANK_NAMES.flatMap((rank) =>
    Array.from(
      {
        length: 6,
      },
      (_, index) =>
        `${rank} ${index + 1}`
    )
  ),
  "MASTER",
];