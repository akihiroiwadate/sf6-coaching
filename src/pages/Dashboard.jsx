import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const students = [
    {
      id: 1,
      name: "Player01",
      coach: "Coach A",
      character: "リュウ",
      rank: "MASTER",
      mr: 1450,
      task: "対空を安定させる",
    },
    {
      id: 2,
      name: "Player02",
      coach: "Coach B",
      character: "ケン",
      rank: "DIAMOND 5",
      mr: "-",
      task: "確反を覚える",
    },
    {
      id: 3,
      name: "Player03",
      coach: "Coach C",
      character: "ジュリ",
      rank: "MASTER",
      mr: 1520,
      task: "リーサル判断を改善する",
    },
  ];

  return (
    <div>
      <header>
        <div>
          <h2>ダッシュボード</h2>
          <p>コーチング全体の状況を確認できます</p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/students/new")}
        >
          ＋ 生徒を追加
        </button>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>生徒数</span>
          <strong>{students.length}</strong>
          <small>人</small>
        </div>

        <div className="stat-card">
          <span>今月のコーチング</span>
          <strong>8</strong>
          <small>回</small>
        </div>

        <div className="stat-card">
          <span>未完了の課題</span>
          <strong>5</strong>
          <small>件</small>
        </div>
      </section>

      <section className="content-card">
        <div className="section-title">
          <h3>生徒</h3>

          <button
            className="text-button"
            onClick={() => navigate("/students")}
          >
            すべて見る
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>プレイヤー</th>
                <th>担当コーチ</th>
                <th>使用キャラ</th>
                <th>ランク</th>
                <th>MR</th>
                <th>現在の課題</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <button
                      className="student-link"
                      onClick={() => navigate(`/students/${student.id}`)}
                    >
                      {student.name}
                    </button>
                  </td>

                  <td>{student.coach}</td>
                  <td>{student.character}</td>

                  <td>
                    <span className="rank">{student.rank}</span>
                  </td>

                  <td>{student.mr}</td>
                  <td>{student.task}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-card">
        <div className="section-title">
          <h3>最近のコーチング</h3>
        </div>

        <div className="coaching-item">
          <div>
            <strong>Player01</strong>
            <p>Coach A / 対空と守りを中心にチェック</p>
          </div>

          <span>8月20日</span>
        </div>

        <div className="coaching-item">
          <div>
            <strong>Player03</strong>
            <p>Coach C / リーサル判断とゲージ管理を確認</p>
          </div>

          <span>8月18日</span>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;