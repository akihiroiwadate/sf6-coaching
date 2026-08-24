import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function StudentMyPage() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [coachingRecords, setCoachingRecords] = useState([]);

  const [selfTask, setSelfTask] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingTask, setSavingTask] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) {
      setErrorMessage("生徒IDが指定されていません。");
      setLoading(false);
      return;
    }

    fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);
    setErrorMessage("");

    const studentId = Number(id);

    if (Number.isNaN(studentId)) {
      setErrorMessage("生徒IDが正しくありません。");
      setLoading(false);
      return;
    }

    // 生徒情報取得
    const { data: studentData, error: studentError } =
      await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .maybeSingle();

    if (studentError) {
      console.error(
        "生徒情報取得エラー:",
        studentError
      );

      setErrorMessage(studentError.message);
      setLoading(false);
      return;
    }

    if (!studentData) {
      setStudent(null);
      setLoading(false);
      return;
    }

    setStudent(studentData);

    // 自分で設定した課題
    setSelfTask(studentData.self_task ?? "");

    // コーチング履歴
    const { data: recordData, error: recordError } =
      await supabase
        .from("coaching_records")
        .select("*")
        .eq("student_id", studentId)
        .order("date", { ascending: false });

    if (recordError) {
      console.error(
        "コーチング履歴取得エラー:",
        recordError
      );

      setErrorMessage(recordError.message);
    } else {
      setCoachingRecords(recordData ?? []);
    }

    setLoading(false);
  }

  // 自分の課題を保存
  async function handleSaveSelfTask() {
    if (!student) return;

    setSavingTask(true);

    const { error } = await supabase
      .from("students")
      .update({
        self_task: selfTask,
      })
      .eq("id", student.id);

    if (error) {
      console.error(
        "課題更新エラー:",
        error
      );

      alert(
        `保存に失敗しました：${error.message}`
      );

      setSavingTask(false);
      return;
    }

    setStudent({
      ...student,
      self_task: selfTask,
    });

    alert("自分の課題を保存しました");

    setSavingTask(false);
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

  if (!student) {
    return (
      <div>
        <h2>マイページ</h2>
        <p>
          生徒情報が見つかりません。
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ヘッダー */}
      <header>
        <div>
          <h2>マイページ</h2>

          <p>
            {student.name} さんの成長記録
          </p>
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

            <strong>
              {student.name}
            </strong>
          </div>

          <div>
            <span className="detail-label">
              スト6 プレイヤーID
            </span>

            <strong>
              {student.player_id || "-"}
            </strong>
          </div>

          <div>
            <span className="detail-label">
              使用キャラクター
            </span>

            <strong>
              {student.character || "-"}
            </strong>
          </div>

          <div>
            <span className="detail-label">
              ランク
            </span>

            <strong>
              {student.rank || "-"}
            </strong>
          </div>

          <div>
            <span className="detail-label">
              MR
            </span>

            <strong>
              {student.mr ?? "-"}
            </strong>
          </div>

          <div>
            <span className="detail-label">
              担当コーチ
            </span>

            <strong>
              {student.coach || "-"}
            </strong>
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
            <span>現在のMR</span>

            <strong>
              {student.mr ?? "-"}
            </strong>
          </div>

          <div className="growth-card">
            <span>
              コーチング回数
            </span>

            <strong>
              {coachingRecords.length}
            </strong>

            <small>回</small>
          </div>

          <div className="growth-card">
            <span>現在のランク</span>

            <strong>
              {student.rank || "-"}
            </strong>
          </div>
        </div>
      </section>

      {/* 目標 */}
      <section className="content-card">
        <div className="section-title">
          <h3>目標</h3>
        </div>

        <p>
          {student.goal || "未設定"}
        </p>
      </section>

      {/* コーチからの課題 */}
      <section className="content-card">
        <div className="section-title">
          <h3>コーチからの課題</h3>
        </div>

        <p>
          {student.task || "未設定"}
        </p>
      </section>

      {/* 生徒自身の課題 */}
      <section className="content-card">
        <div className="section-title">
          <h3>自分で決めた課題</h3>
        </div>

        <div className="form-group">
          <textarea
            value={selfTask}
            onChange={(e) =>
              setSelfTask(e.target.value)
            }
            rows="4"
            placeholder="例：ランクマ10試合で対空を意識する"
          />
        </div>

        <button
          className="primary-button"
          onClick={handleSaveSelfTask}
          disabled={savingTask}
        >
          {savingTask
            ? "保存中..."
            : "課題を保存"}
        </button>
      </section>

      {/* コーチング要望 */}
      <section className="content-card">
        <div className="section-title">
          <h3>コーチング要望</h3>
        </div>

        <p>
          {student.request || "未設定"}
        </p>
      </section>

      {/* プレイ可能時間 */}
      <section className="content-card">
        <div className="section-title">
          <h3>
            ゲームをプレイできる時間
          </h3>
        </div>

        <p>
          {student.game_availability ||
            "未設定"}
        </p>
      </section>

      {/* コーチング可能時間 */}
      <section className="content-card">
        <div className="section-title">
          <h3>
            コーチングを受けられる時間
          </h3>
        </div>

        <p>
          {student.coaching_availability ||
            "未設定"}
        </p>
      </section>

      {/* コーチング履歴 */}
      <section className="content-card">
        <div className="section-title">
          <h3>
            これまでのコーチング
          </h3>

          <span>
            {coachingRecords.length}回
          </span>
        </div>

        {coachingRecords.length === 0 ? (
          <p>
            まだコーチング記録がありません。
          </p>
        ) : (
          <div className="coaching-history">
            {coachingRecords.map(
              (record) => (
                <div
                  className="coaching-record"
                  key={record.id}
                >
                  <div className="coaching-record-header">
                    <div>
                      <strong>
                        {record.date}
                      </strong>

                      <span>
                        {record.coach || ""}
                      </span>
                    </div>
                  </div>

                  <div className="coaching-record-content">
                    <div>
                      <h4>
                        今回の内容
                      </h4>

                      <p>
                        {record.match_content ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <h4>
                        良かったところ
                      </h4>

                      <p>
                        {record.good_points ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <h4>
                        改善ポイント
                      </h4>

                      <p>
                        {record.improvement_points ||
                          "-"}
                      </p>
                    </div>

                    <div>
                      <h4>
                        次回までの課題
                      </h4>

                      <p>
                        {record.next_task ||
                          "-"}
                      </p>
                    </div>

                    {/* コーチ内部memoは表示しない */}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentMyPage;