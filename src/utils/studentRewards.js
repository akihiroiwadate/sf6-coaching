export const REWARD_LEVELS = [
  { level: 1, minPoints: 0, name: "ルーキー" },
  { level: 2, minPoints: 100, name: "チャレンジャー" },
  { level: 3, minPoints: 300, name: "トレーニー" },
  { level: 4, minPoints: 500, name: "ファイター" },
  { level: 5, minPoints: 1000, name: "ウォリアー" },
  { level: 6, minPoints: 2000, name: "エリート" },
  { level: 7, minPoints: 3000, name: "スト6マスター" },
];

export const BADGES = [
  { points: 100, icon: "🥉", name: "はじめの一歩" },
  { points: 500, icon: "🥈", name: "トレーニー" },
  { points: 1000, icon: "🥇", name: "ファイター" },
  { points: 3000, icon: "🏆", name: "スト6マスター" },
];

export function getRewardLevel(totalPoints) {
  let currentLevel = REWARD_LEVELS[0];
  for (const level of REWARD_LEVELS) {
    if (totalPoints >= level.minPoints) currentLevel = level;
  }
  return currentLevel;
}

export function getNextRewardLevel(totalPoints) {
  return REWARD_LEVELS.find((level) => level.minPoints > totalPoints) || null;
}

export function getTotalPoints(rewards) {
  return rewards.reduce((total, reward) => total + Number(reward.points || 0), 0);
}

export function formatRewardDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}
