import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("コーチング記録", {
      studentId: id,
      ...form,
    });

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
        <form className="student-form" onSubmit={handleSubmit}>
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
            <select
              name="coach"
              value={form.coach}
              onChange={handleChange}
              required
            >
              <option value="">選択してください</option>
              <option value="Coach A">Coach A</option>
              <option value="Coach B">Coach B</option>
              <option value="Coach C">Coach C</option>
            </select>
          </div>

          <div className="form-group">
            <label>対戦内容</label>
            <textarea
              name="matchContent"
              value={form.matchContent}
              onChange={handleChange}
              placeholder="例：ランクマのリプレイを3試合確認"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>良かった点</label>
            <textarea
              name="goodPoints"
              value={form.goodPoints}
              onChange={handleChange}
              placeholder="例：確反が安定していた"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>改善点</label>
            <textarea
              name="improvementPoints"
              value={form.improvementPoints}
              onChange={handleChange}
              placeholder="例：飛びを通される回数が多かった"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>次回までの課題</label>
            <textarea
              name="nextTask"
              value={form.nextTask}
              onChange={handleChange}
              placeholder="例：ランクマ10試合で対空を意識する"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>メモ</label>
            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="その他のメモ"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(`/students/${id}`)}
            >
              キャンセル
            </button>

            <button type="submit" className="primary-button">
              登録する
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CoachingNew;