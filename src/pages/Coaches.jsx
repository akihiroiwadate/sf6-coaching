import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Coaches() {
  const navigate = useNavigate();

  const [coaches, setCoaches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setErrorMessage("");

    // コーチ取得
    const { data: coachData, error: coachError } =
      await supabase
        .from("coaches")
        .select("*")
        .order("id", { ascending: true });

    if (coachError) {
      console.error("コーチ取得エラー:", coachError);
      setErrorMessage(coachError.message);
      setLoading(false);
      return;
    }

    // 生徒取得
    const { data: studentData, error: studentError } =
      await supabase
        .from("students")
        .select("id, name, coach");

    if (studentError) {
      console.error("生徒取得エラー:", studentError);
      setErrorMessage(studentError.message);
      setLoading(false);
      return;
    }

    setCoaches(coachData ?? []);
    setStudents(studentData ?? []);
    setLoading(false);
  }

  // 担当生徒数
  function getStudentCount(coachName) {
    return students.filter(
      (student) => student.coach === coachName
    ).length;
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

  return (
    <div>
      <header>
        <div>
          <h2>コーチ一覧</h2>
          <p>
            登録されているコーチを確認できます
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/coaches/new")}
        >
          ＋ コーチを追加
        </button>
      </header>

      <section className="content-card">
        <div className="section-title">
          <h3>コーチ</h3>
          <span>{coaches.length}人</span>
        </div>

        {coaches.length === 0 ? (
          <p>コーチが登録されていません。</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>コーチ名</th>
                  <th>プレイヤーID</th>
                  <th>メインキャラ</th>
                  <th>ランク</th>
                  <th>MR</th>
                  <th>得意分野</th>
                  <th>担当生徒</th>
                </tr>
              </thead>

              <tbody>
                {coaches.map((coach) => (
                  <tr key={coach.id}>
                    <td>
                      <button
                        className="student-link"
                        onClick={() =>
                          navigate(`/coaches/${coach.id}`)
                        }
                      >
                        {coach.name}
                      </button>
                    </td>

                    <td>
                      {coach.sf6_player_id || "-"}
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

                    <td>
                      {getStudentCount(coach.name)}人
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Coaches;