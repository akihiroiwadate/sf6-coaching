import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Dashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [coachingRecords, setCoachingRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    setErrorMessage("");

    // 生徒取得
    const {
      data: studentData,
      error: studentError,
    } = await supabase
      .from("students")
      .select("*")
      .order("id", { ascending: true });

    if (studentError) {
      console.error("生徒取得エラー:", studentError);
      setErrorMessage(studentError.message);
      setLoading(false);
      return;
    }

    // コーチ取得
    const {
      data: coachData,
      error: coachError,
    } = await supabase
      .from("coaches")
      .select("*")
      .order("id", { ascending: true });

    if (coachError) {
      console.error("コーチ取得エラー:", coachError);
      setErrorMessage(coachError.message);
      setLoading(false);
      return;
    }

    // コーチング記録取得
    const {
      data: recordData,
      error: recordError,
    } = await supabase
      .from("coaching_records")
      .select("*")
      .order("date", { ascending: false });

    if (recordError) {
      console.error(
        "コーチング記録取得エラー:",
        recordError
      );

      setErrorMessage(recordError.message);
      setLoading(false);
      return;
    }

    setStudents(studentData ?? []);
    setCoaches(coachData ?? []);
    setCoachingRecords(recordData ?? []);

    setLoading(false);
  }

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (errorMessage) {
    return (
      <div>
        <h2>データ取得エラー</h2>
        <p>{errorMessage}</p>
      </div>
    );
  }

  // 課題が設定されている生徒
  const studentsWithTasks = students.filter(
    (student) =>
      student.task &&
      student.task.trim() !== ""
  );

  // 担当コーチが設定されていない生徒
  const studentsWithoutCoach = students.filter(
    (student) =>
      !student.coach ||
      student.coach.trim() === ""
  );

  // 生徒名取得
  function getStudentName(studentId) {
    const student = students.find(
      (student) => student.id === studentId
    );

    return student?.name ?? "-";
  }

  return (
    <div>
      {/* ヘッダー */}
      <header>
        <div>
          <h2>ダッシュボード</h2>
          <p>
            SF6コーチング全体の状況を確認できます
          </p>
        </div>

        <div className="header-actions">
          <button
            className="cancel-button"
            onClick={() => navigate("/coaches/new")}
          >
            ＋ コーチを追加
          </button>

          <button
            className="primary-button"
            onClick={() => navigate("/students/new")}
          >
            ＋ 生徒を追加
          </button>
        </div>
      </header>

      {/* サマリー */}
      <section className="stats">
        <div className="stat-card">
          <span>生徒数</span>

          <strong>{students.length}</strong>

          <small>人</small>
        </div>

        <div className="stat-card">
          <span>コーチ数</span>

          <strong>{coaches.length}</strong>

          <small>人</small>
        </div>

        <div className="stat-card">
          <span>コーチング記録</span>

          <strong>
            {coachingRecords.length}
          </strong>

          <small>件</small>
        </div>
      </section>

      {/* 要確認 */}
      <section className="stats">
        <div className="stat-card">
          <span>課題あり</span>

          <strong>
            {studentsWithTasks.length}
          </strong>

          <small>人</small>
        </div>

        <div className="stat-card">
          <span>担当コーチ未設定</span>

          <strong>
            {studentsWithoutCoach.length}
          </strong>

          <small>人</small>
        </div>

        <div className="stat-card">
          <span>登録済みプレイヤー</span>

          <strong>
            {
              students.filter(
                (student) => student.player_id
              ).length
            }
          </strong>

          <small>人</small>
        </div>
      </section>

      {/* 生徒一覧 */}
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

        {students.length === 0 ? (
          <p>
            生徒が登録されていません。
          </p>
        ) : (
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
                {students
                  .slice(0, 5)
                  .map((student) => (
                    <tr key={student.id}>
                      <td>
                        <button
                          className="student-link"
                          onClick={() =>
                            navigate(
                              `/students/${student.id}`
                            )
                          }
                        >
                          {student.name}
                        </button>
                      </td>

                      <td>
                        {student.coach || "-"}
                      </td>

                      <td>
                        {student.character || "-"}
                      </td>

                      <td>
                        <span className="rank">
                          {student.rank || "-"}
                        </span>
                      </td>

                      <td>
                        {student.mr ?? "-"}
                      </td>

                      <td>
                        {student.task || "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* コーチ一覧 */}
      <section className="content-card">
        <div className="section-title">
          <h3>コーチ</h3>

          <button
            className="text-button"
            onClick={() => navigate("/coaches")}
          >
            すべて見る
          </button>
        </div>

        {coaches.length === 0 ? (
          <p>
            コーチが登録されていません。
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>コーチ</th>
                  <th>メインキャラ</th>
                  <th>ランク</th>
                  <th>MR</th>
                  <th>得意分野</th>
                </tr>
              </thead>

              <tbody>
                {coaches
                  .slice(0, 5)
                  .map((coach) => (
                    <tr key={coach.id}>
                      <td>
                        <button
                          className="student-link"
                          onClick={() =>
                            navigate(
                              `/coaches/${coach.id}`
                            )
                          }
                        >
                          {coach.name}
                        </button>
                      </td>

                      <td>
                        {coach.main_character || "-"}
                      </td>

                      <td>
                        <span className="rank">
                          {coach.rank || "-"}
                        </span>
                      </td>

                      <td>
                        {coach.mr ?? "-"}
                      </td>

                      <td>
                        {coach.specialty || "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 最近のコーチング */}
      <section className="content-card">
        <div className="section-title">
          <h3>最近のコーチング</h3>

          <span>
            {coachingRecords.length}件
          </span>
        </div>

        {coachingRecords.length === 0 ? (
          <p>
            まだコーチング記録がありません。
          </p>
        ) : (
          coachingRecords
            .slice(0, 5)
            .map((record) => (
              <div
                className="coaching-item"
                key={record.id}
              >
                <div>
                  <strong>
                    {record.date} /{" "}
                    {getStudentName(
                      record.student_id
                    )}
                  </strong>

                  <p>
                    {record.match_content ||
                      "内容未登録"}
                  </p>
                </div>

                <button
                  className="text-button"
                  onClick={() =>
                    navigate(
                      `/students/${record.student_id}`
                    )
                  }
                >
                  詳細
                </button>
              </div>
            ))
        )}
      </section>

      {/* 生徒の課題 */}
      <section className="content-card">
        <div className="section-title">
          <h3>現在の課題</h3>
        </div>

        {studentsWithTasks.length === 0 ? (
          <p>
            現在設定されている課題はありません。
          </p>
        ) : (
          studentsWithTasks
            .slice(0, 5)
            .map((student) => (
              <div
                className="coach-alert"
                key={student.id}
              >
                <div>
                  <strong>
                    {student.name}
                  </strong>

                  <p>
                    {student.task}
                  </p>
                </div>

                <button
                  className="text-button"
                  onClick={() =>
                    navigate(
                      `/students/${student.id}`
                    )
                  }
                >
                  確認する
                </button>
              </div>
            ))
        )}
      </section>
    </div>
  );
}

export default Dashboard;