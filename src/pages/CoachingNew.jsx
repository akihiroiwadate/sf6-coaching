import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function CoachingNew() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    date: "",
    coach: "",
    matchContent: "",
    goodPoints: "",
    improvementPoints: "",
    nextTask: "",
    memo: "",
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("coaching_records")
      .insert([
        {
          student_id: Number(id),
          coach: form.coach,
          date: form.date,
          match_content: form.matchContent,
          good_points: form.goodPoints,
          improvement_points: form.improvementPoints,
          next_task: form.nextTask,
          memo: form.memo,
        },
      ]);

    if (error) {
      console.error("登録エラー:", error);
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }

    alert("コーチング記録を登録しました");

    navigate(`/students/${id}`);
  };

  return (
    <div>
      <header>
        <div>
          <h2>コーチング記録</h2>
          <p>今回のコーチング内容を記録します</p>
        </div>
      </header>

      <section className="content-card">
        <form
          className="student-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>実施日</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>担当コーチ</label>

            <input
              type="text"
              name="coach"
              value={form.coach}
              onChange={handleChange}
              placeholder="例：Coach A"
            />
          </div>

          <div className="form-group">
            <label>対戦内容</label>

            <textarea
              name="matchContent"
              value={form.matchContent}
              onChange={handleChange}
              rows="3"
              placeholder="例：ランクマのリプレイを3試合確認"
            />
          </div>

          <div className="form-group">
            <label>良かった点</label>

            <textarea
              name="goodPoints"
              value={form.goodPoints}
              onChange={handleChange}
              rows="4"
              placeholder="例：確反が安定していた"
            />
          </div>

          <div className="form-group">
            <label>改善点</label>

            <textarea
              name="improvementPoints"
              value={form.improvementPoints}
              onChange={handleChange}
              rows="4"
              placeholder="例：飛びを通される回数が多かった"
            />
          </div>

          <div className="form-group">
            <label>次回までの課題</label>

            <textarea
              name="nextTask"
              value={form.nextTask}
              onChange={handleChange}
              rows="4"
              placeholder="例：ランクマ10試合で対空を意識する"
            />
          </div>

          <div className="form-group">
            <label>メモ</label>

            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {errorMessage && (
            <p className="error-message">
              登録に失敗しました：{errorMessage}
            </p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate(`/students/${id}`)
              }
            >
              キャンセル
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "登録中..." : "登録する"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CoachingNew;