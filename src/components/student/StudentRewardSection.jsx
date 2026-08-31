import {
  BADGES,
  formatRewardDate,
  getNextRewardLevel,
  getRewardLevel,
  getTotalPoints,
} from "../../utils/studentRewards";

function StudentRewardSection({ rewards }) {
  const totalPoints = getTotalPoints(rewards);
  const currentLevel = getRewardLevel(totalPoints);
  const nextLevel = getNextRewardLevel(totalPoints);
  const earnedBadges = BADGES.filter((badge) => totalPoints >= badge.points);

  let progressPercent = 100;
  if (nextLevel) {
    progressPercent = ((totalPoints - currentLevel.minPoints) /
      (nextLevel.minPoints - currentLevel.minPoints)) * 100;
    progressPercent = Math.max(0, Math.min(100, progressPercent));
  }

  return (
    <section className="content-card reward-section">
      <div className="section-title">
        <div>
          <h3>リワード</h3>
          <p>コーチングやコーチからの課題を達成してポイントを貯めよう</p>
        </div>
      </div>

      <div className="reward-main">
        <div className="reward-level-card">
          <span className="reward-level-label">LEVEL</span>
          <strong className="reward-level-number">{currentLevel.level}</strong>
          <span className="reward-level-name">{currentLevel.name}</span>
        </div>

        <div className="reward-progress-area">
          <div className="reward-point-row">
            <div>
              <span>現在のポイント</span>
              <strong>{totalPoints}<small>pt</small></strong>
            </div>

            {nextLevel && (
              <div className="reward-next-level">
                <span>次のLEVELまで</span>
                <strong>{nextLevel.minPoints - totalPoints}pt</strong>
              </div>
            )}
          </div>

          <div className="reward-progress">
            <div className="reward-progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="reward-progress-text">
            <span>{totalPoints}pt</span>
            <span>{nextLevel ? `${nextLevel.minPoints}pt` : "MAX"}</span>
          </div>
        </div>
      </div>

      <div className="reward-badge-area">
        <h4>獲得バッジ</h4>
        {earnedBadges.length === 0 ? (
          <p className="reward-empty-text">100pt貯めると最初のバッジを獲得できます</p>
        ) : (
          <div className="reward-badge-list">
            {earnedBadges.map((badge) => (
              <div className="reward-badge" key={badge.name}>
                <span className="reward-badge-icon">{badge.icon}</span>
                <strong>{badge.name}</strong>
                <small>{badge.points}pt</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reward-history-area">
        <div className="reward-history-title">
          <h4>最近の獲得</h4>
          <span>{rewards.length}件</span>
        </div>

        {rewards.length === 0 ? (
          <p className="reward-empty-text">まだポイントを獲得していません</p>
        ) : (
          <div className="reward-history">
            {rewards.slice(0, 5).map((reward) => (
              <div className="reward-history-item" key={reward.id}>
                <div>
                  <strong>{reward.reason}</strong>
                  <span>{formatRewardDate(reward.created_at)}</span>
                </div>
                <strong className="reward-history-points">
                  {reward.points > 0 ? "+" : ""}{reward.points}pt
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default StudentRewardSection;
