import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function CoachNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sf6PlayerId: "",
    mainCharacter: "",
    rank: "",
    mr: "",
    bio: "",
    specialty: "",
    availability: "",
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
      .from("coaches")
      .insert([
        {
          name: form.name,
          sf6_player_id: form.sf6PlayerId,
          main_character: form.mainCharacter,
          rank: form.rank,
          mr: form.mr === "" ? null : Number(form.mr),
          bio: form.bio,
          specialty: form.specialty,
          availability: form.availability,
        },
      ]);

    if (error) {
      console.error("コーチ登録エラー:", error);
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }

    alert("コーチを登録しました");
    navigate("/coach");
  };

  return (
    <div>
      <header>
        <div>
          <h2>コーチ登録</h2>
          <p>新しいコーチの情報を登録します</p>
        </div>
      </header>

      <section className="content-card">
        <form className="student-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>コーチ名</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>スト6 プレイヤーID</label>
            <input
              type="text"
              name="sf6PlayerId"
              value={form.sf6PlayerId}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>メインキャラクター</label>
            <input
              type="text"
              name="mainCharacter"
              value={form.mainCharacter}
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
              <option value="DIAMOND">DIAMOND</option>
              <option value="MASTER">MASTER</option>
              <option value="LEGEND">LEGEND</option>
            </select>
          </div>

          <div className="form-group">
            <label>MR</label>
            <input
              type="number"
              name="mr"
              value={form.mr}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>自己紹介</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="4"
              placeholder="例：初心者〜MASTER帯を中心に指導しています"
            />
          </div>

          <div className="form-group">
            <label>得意なコーチング</label>
            <textarea
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              rows="4"
              placeholder="例：対空、守り、キャラ対策、リーサル判断"
            />
          </div>

          <div className="form-group">
            <label>コーチング可能時間</label>
            <textarea
              name="availability"
              value={form.availability}
              onChange={handleChange}
              rows="3"
              placeholder="例：平日 20:00〜23:00、土日 13:00〜20:00"
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
              onClick={() => navigate("/coach")}
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

export default CoachNew;