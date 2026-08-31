import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const RANK_OPTIONS = [
  "ROOKIE",
  "IRON 1", "IRON 2", "IRON 3", "IRON 4", "IRON 5",
  "BRONZE 1", "BRONZE 2", "BRONZE 3", "BRONZE 4", "BRONZE 5",
  "SILVER 1", "SILVER 2", "SILVER 3", "SILVER 4", "SILVER 5",
  "GOLD 1", "GOLD 2", "GOLD 3", "GOLD 4", "GOLD 5",
  "PLATINUM 1", "PLATINUM 2", "PLATINUM 3", "PLATINUM 4", "PLATINUM 5",
  "DIAMOND 1", "DIAMOND 2", "DIAMOND 3", "DIAMOND 4", "DIAMOND 5",
  "MASTER",
  "LEGEND",
];

function StudentPlayerInfo({ student, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [loadingCoaches, setLoadingCoaches] = useState(false);
  const [name, setName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [character, setCharacter] = useState("");
  const [rank, setRank] = useState("");
  const [mr, setMr] = useState("");
  const [coach, setCoach] = useState("");

  useEffect(() => {
    fetchCoaches();
  }, []);

  async function fetchCoaches() {
    setLoadingCoaches(true);
    const { data, error } = await supabase
      .from("coaches")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("コーチ一覧取得エラー:", error);
      setCoaches([]);
    } else {
      setCoaches(data ?? []);
    }
    setLoadingCoaches(false);
  }

  function handleEdit() {
    setName(student.name || "");
    setPlayerId(student.player_id || "");
    setCharacter(student.character || "");
    setRank(student.rank || "");
    setMr(student.mr === null || student.mr === undefined ? "" : String(student.mr));
    setCoach(student.coach || "");
    setEditing(true);
  }

  async function handleSave() {
    if (!name.trim()) {
      alert("プレイヤー名を入力してください。");
      return;
    }

    let mrValue = null;
    if (String(mr).trim() !== "") {
      mrValue = Number(mr);
      if (Number.isNaN(mrValue) || mrValue < 0) {
        alert("MRは0以上の数値で入力してください。");
        return;
      }
    }

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from("students")
        .update({
          name: name.trim(),
          player_id: playerId.trim() || null,
          character: character.trim() || null,
          rank: rank || null,
          mr: mrValue,
          coach: coach || null,
        })
        .eq("id", student.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("プレイヤー情報を更新できませんでした。");

      localStorage.setItem("studentName", data.name);
      onUpdated?.(data);
      setEditing(false);
      alert("プレイヤー情報を更新しました。");
    } catch (error) {
      console.error("プレイヤー情報更新エラー:", error);
      alert(`更新に失敗しました：${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  const currentRankIsCustom = rank && !RANK_OPTIONS.includes(rank);
  const currentCoachExists = !coach || coaches.some((coachData) => coachData.name === coach);

  return (
    <section className="content-card">
      <div className="section-title">
        <h3>プレイヤー情報</h3>
        {!editing && (
          <button type="button" className="primary-button" onClick={handleEdit}>編集</button>
        )}
      </div>

      {editing ? (
        <div className="student-form">
          <div className="form-group">
            <label>プレイヤー名</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>スト6 プレイヤーID</label>
            <input type="text" value={playerId} onChange={(e) => setPlayerId(e.target.value)} />
          </div>

          <div className="form-group">
            <label>使用キャラクター</label>
            <input type="text" value={character} onChange={(e) => setCharacter(e.target.value)} />
          </div>

          <div className="form-group">
            <label>ランク</label>
            <select value={rank} onChange={(e) => setRank(e.target.value)}>
              <option value="">選択してください</option>
              {currentRankIsCustom && <option value={rank}>{rank}</option>}
              {RANK_OPTIONS.map((rankOption) => (
                <option key={rankOption} value={rankOption}>{rankOption}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>MR</label>
            <input type="number" min="0" value={mr} onChange={(e) => setMr(e.target.value)} />
          </div>

          <div className="form-group">
            <label>担当コーチ</label>
            <select
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
              disabled={loadingCoaches}
            >
              <option value="">未設定</option>
              {!currentCoachExists && <option value={coach}>{coach}</option>}
              {coaches.map((coachData) => (
                <option key={coachData.id} value={coachData.name}>{coachData.name}</option>
              ))}
            </select>
            {loadingCoaches && <small>コーチ一覧を読み込み中...</small>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      ) : (
        <div className="student-detail-grid">
          <div><span className="detail-label">プレイヤー名</span><strong>{student.name}</strong></div>
          <div><span className="detail-label">スト6 プレイヤーID</span><strong>{student.player_id || "-"}</strong></div>
          <div><span className="detail-label">使用キャラクター</span><strong>{student.character || "-"}</strong></div>
          <div><span className="detail-label">ランク</span><strong>{student.rank || "-"}</strong></div>
          <div><span className="detail-label">MR</span><strong>{student.mr ?? "-"}</strong></div>
          <div><span className="detail-label">担当コーチ</span><strong>{student.coach || "-"}</strong></div>
        </div>
      )}
    </section>
  );
}

export default StudentPlayerInfo;
