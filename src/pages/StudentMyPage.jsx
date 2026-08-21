function StudentMyPage() {
  const student = {
    name: "Player01",
    playerId: "1234567890",
    character: "リュウ",
    rank: "MASTER",
    mr: 1450,

    goal: "MR1600を目指す",

    request:
      "守りを中心に見てほしい。起き攻めへの対応を改善したい。",

    gameAvailability:
      "月・水・金 19:00〜23:00、土 13:00〜23:00",

    coachingAvailability:
      "水 20:00〜22:00、土 14:00〜18:00",

    selfAnalysis: {
      strengths: [
        "コンボには自信がある",
        "攻めを継続するのが得意",
      ],
      weaknesses: [
        "守りが苦手",
        "画面端になると焦ってしまう",
        "対空に自信がない",
      ],
    },

    currentTask:
      "画面端での守りを安定させる",

    nextPractice:
      "ランクマを10試合プレイして、画面端では無理に暴れず、まず相手の攻めを見ることを意識する。",

    coachMessage:
      "攻めとコンボはかなり安定しています。次は守りを少しずつ整理して、苦しい場面でも落ち着いて対応できるようにしていきましょう。",

    growth: {
      previousMr: 1388,
      currentMr: 1450,
      completedTasks: 3,
      coachingCount: 6,

      skills: [
        {
          name: "対空",
          previous: 2,
          current: 4,
        },
        {
          name: "確反",
          previous: 3,
          current: 4,
        },
        {
          name: "ゲージ管理",
          previous: 3,
          current: 3,
        },
        {
          name: "リーサル判断",
          previous: 1,
          current: 3,
        },
      ],
    },

    completedTasks: [
      {
        id: 1,
        title: "基本コンボを安定させる",
      },
      {
        id: 2,
        title: "確反を3種類覚える",
      },
      {
        id: 3,
        title: "対空を意識して10試合プレイ",
      },
    ],

    coachingHistory: [
      {
        id: 1,
        date: "2026/08/20",
        title: "対空と守り",
        summary:
          "飛びへの反応が改善しました。次は画面端での守りを練習します。",
      },
      {
        id: 2,
        date: "2026/08/13",
        title: "確反とゲージ管理",
        summary:
          "確反が安定してきました。ゲージ管理にも少しずつ取り組んでいます。",
      },
    ],
  };

  return (
    <div>
      <header>
        <div>
          <h2>マイページ</h2>
          <p>{student.name} さんの成長状況</p>
        </div>
      </header>

      {/* プレイヤー情報 */}
      <section className="content-card">
        <div className="section-title">
          <h3>プレイヤー情報</h3>
        </div>

        <div className="student-detail-grid">
          <div>
            <span className="detail-label">
              プレイヤー名
            </span>
            <strong>{student.name}</strong>
          </div>

          <div>
            <span className="detail-label">
              スト6 プレイヤーID
            </span>
            <strong>{student.playerId}</strong>
          </div>

          <div>
            <span className="detail-label">
              使用キャラクター
            </span>
            <strong>{student.character}</strong>
          </div>

          <div>
            <span className="detail-label">
              ランク
            </span>
            <strong>{student.rank}</strong>
          </div>

          <div>
            <span className="detail-label">
              MR
            </span>
            <strong>{student.mr}</strong>
          </div>
        </div>
      </section>

      {/* 成長サマリー */}
      <section className="content-card">
        <div className="section-title">
          <h3>成長サマリー</h3>
        </div>

        <div className="growth-summary">
          <div className="growth-card">
            <span>MR</span>

            <strong>
              {student.growth.previousMr}
              {" → "}
              {student.growth.currentMr}
            </strong>

            <p className="growth-positive">
              +
              {student.growth.currentMr -
                student.growth.previousMr}
            </p>
          </div>

          <div className="growth-card">
            <span>達成した課題</span>
            <strong>
              {student.growth.completedTasks}
            </strong>
            <p>件</p>
          </div>

          <div className="growth-card">
            <span>コーチング回数</span>
            <strong>
              {student.growth.coachingCount}
            </strong>
            <p>回</p>
          </div>
        </div>

        <div className="skill-growth">
          <h4>スキルの成長</h4>

          {student.growth.skills.map((skill) => {
            const difference =
              skill.current - skill.previous;

            return (
              <div
                className="skill-row"
                key={skill.name}
              >
                <span className="skill-name">
                  {skill.name}
                </span>

                <span className="stars">
                  {"★".repeat(skill.previous)}
                  {"☆".repeat(5 - skill.previous)}
                </span>

                <span>→</span>

                <span className="stars">
                  {"★".repeat(skill.current)}
                  {"☆".repeat(5 - skill.current)}
                </span>

                {difference > 0 && (
                  <span className="growth-positive">
                    +{difference}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 自分のプレイ分析 */}
      <section className="content-card">
        <div className="section-title">
          <h3>自分のプレイ分析</h3>
        </div>

        <div className="analysis-grid">
          <div className="analysis-block">
            <h4>自分の長所</h4>

            <ul>
              {student.selfAnalysis.strengths.map(
                (item, index) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>
          </div>

          <div className="analysis-block">
            <h4>苦手だと思うこと</h4>

            <ul>
              {student.selfAnalysis.weaknesses.map(
                (item, index) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* コーチからのメッセージ */}
      <section className="content-card">
        <div className="section-title">
          <h3>コーチからのメッセージ</h3>
        </div>

        <p>{student.coachMessage}</p>
      </section>

      {/* 目標 */}
      <section className="content-card">
        <div className="section-title">
          <h3>目標</h3>
        </div>

        <p>{student.goal}</p>
      </section>

      {/* 現在の課題 */}
      <section className="content-card">
        <div className="section-title">
          <h3>現在取り組むこと</h3>
        </div>

        <h4>{student.currentTask}</h4>
      </section>

      {/* 練習 */}
      <section className="content-card">
        <div className="section-title">
          <h3>次回までの練習</h3>
        </div>

        <p>{student.nextPractice}</p>
      </section>

      {/* 達成済み */}
      <section className="content-card">
        <div className="section-title">
          <h3>できるようになったこと</h3>
        </div>

        <div className="completed-task-list">
          {student.completedTasks.map((task) => (
            <div
              className="completed-task"
              key={task.id}
            >
              <span>✓</span>
              <strong>{task.title}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* コーチング要望 */}
      <section className="content-card">
        <div className="section-title">
          <h3>コーチング要望</h3>
        </div>

        <p>{student.request}</p>
      </section>

      {/* 時間 */}
      <section className="content-card">
        <div className="section-title">
          <h3>ゲームをプレイできる時間</h3>
        </div>

        <p>{student.gameAvailability}</p>
      </section>

      <section className="content-card">
        <div className="section-title">
          <h3>コーチングを受けられる時間</h3>
        </div>

        <p>{student.coachingAvailability}</p>
      </section>

      {/* 履歴 */}
      <section className="content-card">
        <div className="section-title">
          <h3>これまでのコーチング</h3>
        </div>

        {student.coachingHistory.map((history) => (
          <div
            className="coaching-item"
            key={history.id}
          >
            <div>
              <strong>
                {history.date} / {history.title}
              </strong>

              <p>{history.summary}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default StudentMyPage;