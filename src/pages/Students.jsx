import { useNavigate } from "react-router-dom";

function Students() {
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
          <h2>生徒一覧</h2>
          <p>登録されている生徒を確認できます</p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/students/new")}
        >
          ＋ 生徒を追加
        </button>
      </header>

      <section className="content-card">
        <div className="section-title">
          <h3>生徒</h3>
          <span>{students.length}人</span>
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
    </div>
  );
}

export default Students;