import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function CoachDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [coach, setCoach] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);
    setErrorMessage("");

    const coachId = Number(id);

    if (Number.isNaN(coachId)) {
      setErrorMessage("コーチIDが正しくありません。");
      setLoading(false);
      return;
    }

    // コーチ情報取得
    const { data: coachData, error: coachError } =
      await supabase
        .from("coaches")
        .select("*")
        .eq("id", coachId)
        .maybeSingle();

    if (coachError) {
      console.error("コーチ取得エラー:", coachError);
      setErrorMessage(coachError.message);
      setLoading(false);
      return;
    }

    if (!coachData) {
      setCoach(null);
      setLoading(false);
      return;
    }

    setCoach(coachData);

    // 担当生徒取得
    const { data: studentData, error: studentError } =
      await supabase
        .from("students")
        .select("*")
        .eq("coach", coachData.name)
        .order("id", { ascending: true });

    if (studentError) {
      console.error("担当生徒取得エラー:", studentError);
      setErrorMessage(studentError.message);
    } else {
      setStudents(studentData ?? []);
    }

    setLoading(false);
  }

  async function handleDelete() {
    if (!coach) return;

    const confirmed = window.confirm(
      `${coach.name} を削除しますか？`
    );

    if (!confirmed) return;

    const { data, error } = await supabase
      .from("coaches")
      .delete()
      .eq("id", coach.id)
      .select();

    if (error) {
      console.error("コーチ削除エラー:", error);
      alert(`削除に失敗しました：${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      alert("削除できませんでした。RLS設定を確認してください。");
      return;
    }

    alert("コーチを削除しました");
    navigate("/coaches");
  }

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (errorMessage) {
    return (
      <div>
        <h2>データ取得エラー</h2>
        <p>{errorMessage}</p>

        <button
          className="cancel-button"
          onClick={() => navigate("/coaches")}
        >
          コーチ一覧に戻る
        </button>
      </div>
    );
  }

  if (!coach) {
    return (
      <div>
        <h2>コーチが見つかりません</h2>

        <button
          className="cancel-button"
          onClick={() => navigate("/coaches")}
        >
          コーチ一覧に戻る
        </button>
      </div>
    );
  }

  return (
    <div>
      <header>
        <div>
          <h2>{coach.name}</h2>
          <p>コーチ詳細</p>
        </div>

        <div className="header-actions">
          <button
            className="cancel-button"
            onClick={() => navigate("/coaches")}
          >
            コーチ一覧に戻る
          </button>

          <button
            className="delete-button"
            onClick={handleDelete}
          >
            コーチを削除
          </button>
        </div>
      </header>

      {/* 基本情報 */}
      <section className="content-card">
        <div className="section-title">
          <h3>基本情報</h3>
        </div>

        <div className="student-detail-grid">
          <div>
            <span className="detail-label">
              コーチ名
            </span>
            <strong>{coach.name}</strong>
          </div>

          <div>
            <span className="detail-label">
              スト6 プレイヤーID
            </span>
            <strong>
              {coach.sf6_player_id || "-"}
            </strong>
          </div>

          <div>
            <span className="detail-label">
              メインキャラクター
            </span>
            <strong>
              {coach.main_character || "-"}
            </strong>
          </div>

          <div>
            <span className="detail-label">
              ランク
            </span>
            <strong>
              {coach.rank || "-"}
            </strong>
          </div>

          <div>
            <span className="detail-label">
              MR
            </span>
            <strong>
              {coach.mr ?? "-"}
            </strong>
          </div>

          <div>
            <span className="detail-label">
              担当生徒数
            </span>
            <strong>
              {students.length}人
            </strong>
          </div>
        </div>
      </section>

      {/* 得意分野 */}
      <section className="content-card">
        <div className="section-title">
          <h3>得意なコーチング</h3>
        </div>

        <p>
          {coach.specialty || "未設定"}
        </p>
      </section>

      {/* 自己紹介 */}
      <section className="content-card">
        <div className="section-title">
          <h3>自己紹介</h3>
        </div>

        <p>
          {coach.bio || "未設定"}
        </p>
      </section>

      {/* 対応可能時間 */}
      <section className="content-card">
        <div className="section-title">
          <h3>コーチング可能時間</h3>
        </div>

        <p>
          {coach.availability || "未設定"}
        </p>
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
    </div>
  );
}

export default CoachDetail;