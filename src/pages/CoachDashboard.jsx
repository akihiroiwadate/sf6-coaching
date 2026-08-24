
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function CoachDashboard() {
  const navigate = useNavigate();

  // 開発確認用
  const coachName = "Coach A";

  const [coach, setCoach] = useState(null);
  const [students, setStudents] = useState([]);
  const [coachingRecords, setCoachingRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    setErrorMessage("");

    // コーチ情報取得
    const { data: coachData, error: coachError } = await supabase
      .from("coaches")
      .select("*")
      .eq("name", coachName)
      .maybeSingle();

    if (coachError) {
      setErrorMessage(coachError.message);
      setLoading(false);
      return;
    }

    setCoach(coachData);

    // 担当生徒取得
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("coach", coachName)
      .order("id", { ascending: true });

    if (studentError) {
      setErrorMessage(studentError.message);
      setLoading(false);
      return;
    }

    const fetchedStudents = studentData ?? [];
    setStudents(fetchedStudents);

    // 担当生徒がいない場合
    if (fetchedStudents.length === 0) {
      setCoachingRecords([]);
      setLoading(false);
      return;
    }

    const studentIds = fetchedStudents.map((student) => student.id);

    // コーチング履歴取得
    const { data: recordData, error: recordError } = await supabase
      .from("coaching_records")
      .select("*")
      .in("student_id", studentIds)
      .order("date", { ascending: false });

    if (recordError) {
      setErrorMessage(recordError.message);
    } else {
      setCoachingRecords(recordData ?? []);
    }

    setLoading(false);
  }

  // 生徒名取得
  function getStudentName(studentId) {
    const student = students.find((student) => student.id === studentId);
    return student?.name ?? "-";
  }

  // コーチング回数
  function getCoachingCount(studentId) {
    return coachingRecords.filter(
      (record) => record.student_id === studentId
    ).length;
  }

  // 最新コーチング日
  function getLatestCoachingDate(studentId) {
    const records = coachingRecords.filter(
      (record) => record.student_id === studentId
    );

    if (records.length === 0) {
      return "-";
    }

    return records[0].date;
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

  const studentsWithCoachTask = students.filter(
    (student) => student.task && student.task.trim() !== ""
  );

  const studentsWithSelfTask = students.filter(
    (student) => student.self_task && student.self_task.trim() !== ""
  );

  return (
    <div>
      {/* ヘッダー */}
      <header>
        <div>
          <h2>コーチダッシュボード</h2>
          <p>{coach?.name || coachName} さんの担当状況</p>
        </div>
      </header>

      {/* サマリー */}
      <section className="stats">
        <div className="stat-card">
          <span>担当生徒</span>
          <strong>{students.length}</strong>
          <small>人</small>
        </div>

        <div className="stat-card">
          <span>コーチング記録</span>
          <strong>{coachingRecords.length}</strong>
          <small>件</small>
        </div>

        <div className="stat-card">
          <span>生徒が設定した課題</span>
          <strong>{studentsWithSelfTask.length}</strong>
          <small>人</small>
        </div>
      </section>

      {/* 担当生徒 */}
      <section className="content-card">
        <div className="section-title">
          <h3>担当生徒</h3>
          <span>{students.length}人</span>
        </div>

        {students.length === 0 ? (
          <p>担当生徒はいません。</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>プレイヤー</th>
                  <th>キャラクター</th>
                  <th>ランク</th>
                  <th>MR</th>
                  <th>コーチング</th>
                  <th>前回</th>
                  <th>操作</th>
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

                    <td>{student.character || "-"}</td>

                    <td>
                      <span className="rank">
                        {student.rank || "-"}
                      </span>
                    </td>

                    <td>{student.mr ?? "-"}</td>

                    <td>{getCoachingCount(student.id)}回</td>

                    <td>{getLatestCoachingDate(student.id)}</td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="text-button"
                          onClick={() =>
                            navigate(`/students/${student.id}`)
                          }
                        >
                          詳細
                        </button>

                        <button
                          className="primary-button"
                          onClick={() =>
                            navigate(
                              `/students/${student.id}/coaching/new`
                            )
                          }
                        >
                          コーチング開始
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 生徒自身の課題 */}
      <section className="content-card">
        <div className="section-title">
          <h3>生徒が設定した課題</h3>
          <span>{studentsWithSelfTask.length}人</span>
        </div>

        {studentsWithSelfTask.length === 0 ? (
          <p>生徒が設定した課題はありません。</p>
        ) : (
          studentsWithSelfTask.map((student) => (
            <div className="coach-alert" key={student.id}>
              <div>
                <strong>{student.name}</strong>
                <p>{student.self_task}</p>
              </div>

              <div className="table-actions">
                <button
                  className="text-button"
                  onClick={() =>
                    navigate(`/students/${student.id}`)
                  }
                >
                  詳細
                </button>

                <button
                  className="primary-button"
                  onClick={() =>
                    navigate(
                      `/students/${student.id}/coaching/new`
                    )
                  }
                >
                  開始
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* コーチからの課題 */}
      <section className="content-card">
        <div className="section-title">
          <h3>コーチからの課題</h3>
          <span>{studentsWithCoachTask.length}人</span>
        </div>

        {studentsWithCoachTask.length === 0 ? (
          <p>課題が設定されていません。</p>
        ) : (
          studentsWithCoachTask.map((student) => (
            <div className="coach-alert" key={student.id}>
              <div>
                <strong>{student.name}</strong>
                <p>{student.task}</p>
              </div>

              <div className="table-actions">
                <button
                  className="text-button"
                  onClick={() =>
                    navigate(`/students/${student.id}`)
                  }
                >
                  詳細
                </button>

                <button
                  className="primary-button"
                  onClick={() =>
                    navigate(
                      `/students/${student.id}/coaching/new`
                    )
                  }
                >
                  開始
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* 最近のコーチング */}
      <section className="content-card">
        <div className="section-title">
          <h3>最近のコーチング</h3>
          <span>{coachingRecords.length}件</span>
        </div>

        {coachingRecords.length === 0 ? (
          <p>まだコーチング記録がありません。</p>
        ) : (
          coachingRecords.slice(0, 5).map((record) => (
            <div className="coaching-item" key={record.id}>
              <div>
                <strong>
                  {record.date} / {getStudentName(record.student_id)}
                </strong>
                <p>{record.match_content || "内容未登録"}</p>
              </div>

              <div className="table-actions">
                <button
                  className="text-button"
                  onClick={() =>
                    navigate(`/students/${record.student_id}`)
                  }
                >
                  詳細
                </button>

                <button
                  className="primary-button"
                  onClick={() =>
                    navigate(
                      `/students/${record.student_id}/coaching/new`
                    )
                  }
                >
                  再コーチング
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default CoachDashboard;