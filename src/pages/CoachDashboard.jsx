import { useNavigate } from "react-router-dom";

function CoachDashboard() {
  const navigate = useNavigate();

  const coach = {
    id: 1,
    name: "Coach A",
  };

  const students = [
    {
      id: 1,
      name: "Player01",
      character: "リュウ",
      rank: "MASTER",
      mr: 1450,
      task: "対空を安定させる",
      lastCoaching: "2026/08/20",
    },
    {
      id: 2,
      name: "Player02",
      character: "ケン",
      rank: "DIAMOND 5",
      mr: "-",
      task: "確反を覚える",
      lastCoaching: "2026/08/07",
    },
    {
      id: 3,
      name: "Player03",
      character: "ジュリ",
      rank: "MASTER",
      mr: 1520,
      task: "リーサル判断を改善する",
      lastCoaching: "2026/08/18",
    },
  ];

  const todaySchedule = [
    {
      id: 1,
      time: "19:00",
      studentId: 1,
      studentName: "Player01",
      theme: "対空と守り",
    },
    {
      id: 2,
      time: "21:00",
      studentId: 3,
      studentName: "Player03",
      theme: "リーサル判断",
    },
  ];

  const alerts = [
    {
      id: 1,
      studentId: 2,
      studentName: "Player02",
      message: "前回のコーチングから14日経過しています",
    },
    {
      id: 2,
      studentId: 3,
      studentName: "Player03",
      message: "現在の課題を確認してください",
    },
  ];

  return (
    <div>
      <header>
        <div>
          <h2>コーチダッシュボード</h2>
          <p>{coach.name} の担当状況を確認できます</p>
        </div>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>担当生徒</span>
          <strong>{students.length}</strong>
          <small>人</small>
        </div>

        <div className="stat-card">
          <span>今日のコーチング</span>
          <strong>{todaySchedule.length}</strong>
          <small>件</small>
        </div>

        <div className="stat-card">
          <span>要確認</span>
          <strong>{alerts.length}</strong>
          <small>件</small>
        </div>
      </section>

      <section className="content-card">
        <div className="section-title">
          <h3>今日のコーチング</h3>
        </div>

        {todaySchedule.map((schedule) => (
          <div className="coaching-item" key={schedule.id}>
            <div>
              <strong>
                {schedule.time}　{schedule.studentName}
              </strong>

              <p>{schedule.theme}</p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                navigate(`/students/${schedule.studentId}`)
              }
            >
              生徒を見る
            </button>
          </div>
        ))}
      </section>

      <section className="content-card">
        <div className="section-title">
          <h3>要確認</h3>
        </div>

        {alerts.map((alert) => (
          <div className="coach-alert" key={alert.id}>
            <div>
              <strong>{alert.studentName}</strong>
              <p>{alert.message}</p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                navigate(`/students/${alert.studentId}`)
              }
            >
              確認する
            </button>
          </div>
        ))}
      </section>

      <section className="content-card">
        <div className="section-title">
          <h3>担当生徒</h3>
          <span>{students.length}人</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>プレイヤー</th>
                <th>使用キャラ</th>
                <th>ランク</th>
                <th>MR</th>
                <th>現在の課題</th>
                <th>前回</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <button
                      className="student-link"
                      onClick={() =>
                        navigate(`/students/${student.id}`)
                      }
                    >
                      {student.name}
                    </button>
                  </td>

                  <td>{student.character}</td>

                  <td>
                    <span className="rank">{student.rank}</span>
                  </td>

                  <td>{student.mr}</td>
                  <td>{student.task}</td>
                  <td>{student.lastCoaching}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default CoachDashboard;