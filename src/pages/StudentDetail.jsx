import { useNavigate, useParams } from "react-router-dom";

function StudentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const students = [
    {
      id: 1,
      name: "Player01",
      playerId: "1234567890",
      coach: "Coach A",
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

      coachAnalysis: {
        strengths: [
          "コンボ精度が高い",
          "攻めの継続力がある",
          "チャンス時の火力を取れている",
        ],
        improvementPoints: [
          "画面端での守りを改善する",
          "相手の飛びを通す回数を減らす",
          "守りでドライブゲージを使いすぎない",
        ],
      },

      task: "画面端での守りを安定させる",

      taskReason:
        "本人も守りを苦手と感じており、コーチから見ても改善効果が大きいため。",

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

      coachingHistory: [
        {
          id: 1,
          date: "2026/08/20",
          content: "対空と守りを中心にチェック",
        },
        {
          id: 2,
          date: "2026/08/13",
          content: "確反とゲージ管理を確認",
        },
      ],
    },

    {
      id: 2,
      name: "Player02",
      playerId: "2345678901",
      coach: "Coach B",
      character: "ケン",
      rank: "DIAMOND 5",
      mr: "-",

      goal: "MASTERに到達する",

      request: "攻め方とコンボ選択を教えてほしい。",

      gameAvailability:
        "火・木 20:00〜23:00、日 15:00〜22:00",

      coachingAvailability:
        "木 20:00〜22:00、日 16:00〜19:00",

      selfAnalysis: {
        strengths: [
          "攻めるのが好き",
          "インパクトを使うのが得意",
        ],
        weaknesses: [
          "確反がよく分からない",
          "守りで暴れてしまう",
        ],
      },

      coachAnalysis: {
        strengths: [
          "前に出る積極性がある",
          "相手の動きを見て攻められる",
        ],
        improvementPoints: [
          "確反の知識を増やす",
          "起き上がりの選択肢を整理する",
          "無理なインパクトを減らす",
        ],
      },

      task: "確反を覚える",

      taskReason:
        "大きな反撃チャンスを逃す場面が多く、勝率改善につながりやすいため。",

      growth: {
        previousMr: null,
        currentMr: null,
        completedTasks: 2,
        coachingCount: 4,

        skills: [
          {
            name: "対空",
            previous: 2,
            current: 3,
          },
          {
            name: "確反",
            previous: 1,
            current: 3,
          },
          {
            name: "ゲージ管理",
            previous: 2,
            current: 3,
          },
          {
            name: "リーサル判断",
            previous: 2,
            current: 2,
          },
        ],
      },

      coachingHistory: [
        {
          id: 1,
          date: "2026/08/19",
          content: "確反の確認とコンボ練習",
        },
      ],
    },

    {
      id: 3,
      name: "Player03",
      playerId: "3456789012",
      coach: "Coach C",
      character: "ジュリ",
      rank: "MASTER",
      mr: 1520,

      goal: "MR1700を目指す",

      request:
        "試合終盤の判断とリーサル判断を重点的に見てほしい。",

      gameAvailability:
        "月・金 21:00〜24:00、土 18:00〜24:00",

      coachingAvailability:
        "金 21:00〜23:00、土 19:00〜22:00",

      selfAnalysis: {
        strengths: [
          "立ち回りには自信がある",
          "差し返しが得意",
        ],
        weaknesses: [
          "リーサルを逃すことがある",
          "ゲージを残しすぎる",
        ],
      },

      coachAnalysis: {
        strengths: [
          "地上戦が安定している",
          "相手の技に対する反応が良い",
        ],
        improvementPoints: [
          "リーサル状況の判断を速くする",
          "SAゲージを使う判断を改善する",
        ],
      },

      task: "リーサル判断を改善する",

      taskReason:
        "立ち回りは安定しているため、勝ち切る力を伸ばす優先度が高いため。",

      growth: {
        previousMr: 1450,
        currentMr: 1520,
        completedTasks: 4,
        coachingCount: 7,

        skills: [
          {
            name: "対空",
            previous: 3,
            current: 4,
          },
          {
            name: "確反",
            previous: 3,
            current: 4,
          },
          {
            name: "ゲージ管理",
            previous: 2,
            current: 4,
          },
          {
            name: "リーサル判断",
            previous: 2,
            current: 3,
          },
        ],
      },

      coachingHistory: [
        {
          id: 1,
          date: "2026/08/18",
          content: "リーサル判断とゲージ管理を確認",
        },
      ],
    },
  ];

  const student = students.find(
    (student) => student.id === Number(id)
  );

  if (!student) {
    return (
      <div>
        <h2>生徒が見つかりません</h2>

        <button
          className="primary-button"
          onClick={() => navigate("/students")}
        >
          生徒一覧に戻る
        </button>
      </div>
    );
  }

  return (
    <div>
      <header>
        <div>
          <h2>{student.name}</h2>
          <p>コーチ用 生徒詳細</p>
        </div>

        <button
          className="cancel-button"
          onClick={() => navigate("/students")}
        >
          生徒一覧に戻る
        </button>
      </header>

      {/* 基本情報 */}
      <section className="content-card">
        <div className="section-title">
          <h3>基本情報</h3>
        </div>

        <div className="student-detail-grid">
          <div>
            <span className="detail-label">プレイヤー名</span>
            <strong>{student.name}</strong>
          </div>

          <div>
            <span className="detail-label">
              スト6 プレイヤーID
            </span>
            <strong>{student.playerId}</strong>
          </div>

          <div>
            <span className="detail-label">担当コーチ</span>
            <strong>{student.coach}</strong>
          </div>

          <div>
            <span className="detail-label">
              使用キャラクター
            </span>
            <strong>{student.character}</strong>
          </div>

          <div>
            <span className="detail-label">ランク</span>
            <strong>{student.rank}</strong>
          </div>

          <div>
            <span className="detail-label">MR</span>
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

            {student.growth.currentMr !== null ? (
              <>
                <strong>
                  {student.growth.previousMr} →{" "}
                  {student.growth.currentMr}
                </strong>

                <p className="growth-positive">
                  +
                  {student.growth.currentMr -
                    student.growth.previousMr}
                </p>
              </>
            ) : (
              <strong>MASTER到達前</strong>
            )}
          </div>

          <div className="growth-card">
            <span>達成した課題</span>
            <strong>{student.growth.completedTasks}</strong>
            <p>件</p>
          </div>

          <div className="growth-card">
            <span>コーチング回数</span>
            <strong>{student.growth.coachingCount}</strong>
            <p>回</p>
          </div>
        </div>

        <div className="skill-growth">
          <h4>スキルの成長</h4>

          {student.growth.skills.map((skill) => {
            const difference =
              skill.current - skill.previous;

            return (
              <div className="skill-row" key={skill.name}>
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

      {/* 生徒の自己分析 */}
      <section className="content-card">
        <div className="section-title">
          <h3>生徒の自己分析</h3>
        </div>

        <div className="analysis-grid">
          <div className="analysis-block">
            <h4>長所だと思っていること</h4>

            <ul>
              {student.selfAnalysis.strengths.map(
                (item, index) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>
          </div>

          <div className="analysis-block">
            <h4>苦手だと思っていること</h4>

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

      {/* コーチ分析 */}
      <section className="content-card">
        <div className="section-title">
          <h3>コーチ分析</h3>
        </div>

        <div className="analysis-grid">
          <div className="analysis-block">
            <h4>長所</h4>

            <ul>
              {student.coachAnalysis.strengths.map(
                (item, index) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>
          </div>

          <div className="analysis-block">
            <h4>改善ポイント</h4>

            <ul>
              {student.coachAnalysis.improvementPoints.map(
                (item, index) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 現在の重点課題 */}
      <section className="content-card">
        <div className="section-title">
          <h3>現在の重点課題</h3>
        </div>

        <h4>{student.task}</h4>
        <p>{student.taskReason}</p>
      </section>

      {/* 目標 */}
      <section className="content-card">
        <div className="section-title">
          <h3>目標</h3>
        </div>

        <p>{student.goal}</p>
      </section>

      {/* コーチング要望 */}
      <section className="content-card">
        <div className="section-title">
          <h3>コーチング要望</h3>
        </div>

        <p>{student.request}</p>
      </section>

      {/* プレイ可能時間 */}
      <section className="content-card">
        <div className="section-title">
          <h3>ゲームをプレイできる時間</h3>
        </div>

        <p>{student.gameAvailability}</p>
      </section>

      {/* コーチング可能時間 */}
      <section className="content-card">
        <div className="section-title">
          <h3>コーチングを受けられる時間</h3>
        </div>

        <p>{student.coachingAvailability}</p>
      </section>

      {/* コーチング履歴 */}
      <section className="content-card">
        <div className="section-title">
          <h3>コーチング履歴</h3>

          <button
            className="primary-button"
            onClick={() =>
              navigate(`/students/${student.id}/coaching/new`)
            }
          >
            ＋ コーチング記録
          </button>
        </div>

        {student.coachingHistory.map((history) => (
          <div className="coaching-item" key={history.id}>
            <div>
              <strong>{history.date}</strong>
              <p>{history.content}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default StudentDetail;