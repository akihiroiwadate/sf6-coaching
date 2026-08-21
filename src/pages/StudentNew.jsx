import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    playerId: "",
    coach: "",
    character: "",
    rank: "",
    mr: "",
    goal: "",
    request: "",
    gameAvailability: "",
    coachingAvailability: "",
    task: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("登録データ", form);

    alert("生徒を登録しました");

    navigate("/students");
  };

  return (
    <div>
      <header>
        <div>
          <h2>生徒登録</h2>
          <p>新しい生徒の情報を登録します</p>
        </div>
      </header>

      <section className="content-card">
        <form className="student-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>プレイヤー名</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="例：Player01"
              required
            />
          </div>

          <div className="form-group">
            <label>スト6 プレイヤーID</label>
            <input
              name="playerId"
              value={form.playerId}
              onChange={handleChange}
              placeholder="例：1234567890"
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
            <label>使用キャラクター</label>

            <input
              name="character"
              value={form.character}
              onChange={handleChange}
              placeholder="例：リュウ"
            />
          </div>

          <div className="form-group">
            <label>ランク</label>

            <select
              name="rank"
              value={form.rank}
              onChange={handleChange}
            >
              <option value="">選択してください</option>
              <option value="ROOKIE">ROOKIE</option>
              <option value="IRON">IRON</option>
              <option value="BRONZE">BRONZE</option>
              <option value="SILVER">SILVER</option>
              <option value="GOLD">GOLD</option>
              <option value="PLATINUM">PLATINUM</option>
              <option value="DIAMOND">DIAMOND</option>
              <option value="MASTER">MASTER</option>
            </select>
          </div>

          <div className="form-group">
            <label>MR</label>

            <input
              type="number"
              name="mr"
              value={form.mr}
              onChange={handleChange}
              placeholder="例：1450"
            />
          </div>

          <div className="form-group">
            <label>目標</label>

            <textarea
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="例：MR1600を目指す"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>コーチング要望</label>

            <textarea
              name="request"
              value={form.request}
              onChange={handleChange}
              placeholder="例：守りを重点的に見てほしい"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>ゲームをプレイできる時間</label>

            <textarea
              name="gameAvailability"
              value={form.gameAvailability}
              onChange={handleChange}
              placeholder="例：月・水・金 19:00〜23:00"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>コーチングを受けられる時間</label>

            <textarea
              name="coachingAvailability"
              value={form.coachingAvailability}
              onChange={handleChange}
              placeholder="例：水 20:00〜22:00、土 14:00〜18:00"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>現在の課題</label>

            <textarea
              name="task"
              value={form.task}
              onChange={handleChange}
              placeholder="例：対空を安定させる"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/students")}
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

export default StudentNew;