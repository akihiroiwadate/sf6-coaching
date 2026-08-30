import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  supabase,
} from "../lib/supabase";

import {
  RANK_OPTIONS,
} from "../constants/ranks";


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

  const [coaches, setCoaches] =
    useState([]);

  const [
    loadingCoaches,
    setLoadingCoaches,
  ] = useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  useEffect(() => {
    fetchCoaches();
  }, []);


  const fetchCoaches =
    async () => {
      setLoadingCoaches(true);

      const {
        data,
        error,
      } = await supabase
        .from("coaches")
        .select("id, name")
        .order("name", {
          ascending: true,
        });

      if (error) {
        console.error(
          "コーチ一覧取得エラー:",
          error
        );

        setErrorMessage(
          "コーチ一覧の取得に失敗しました"
        );

        setLoadingCoaches(false);

        return;
      }

      setCoaches(data || []);

      setLoadingCoaches(false);
    };


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };


  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setSaving(true);
      setErrorMessage("");

      const {
        error,
      } = await supabase
        .from("students")
        .insert([
          {
            name:
              form.name,

            player_id:
              form.playerId,

            coach:
              form.coach ||
              null,

            character:
              form.character,

            rank:
              form.rank,

            mr:
              form.mr === ""
                ? null
                : Number(
                    form.mr
                  ),

            goal:
              form.goal,

            request:
              form.request,

            game_availability:
              form.gameAvailability,

            coaching_availability:
              form.coachingAvailability,

            task:
              form.task,
          },
        ]);

      if (error) {
        console.error(
          "登録エラー:",
          error
        );

        setErrorMessage(
          error.message
        );

        setSaving(false);

        return;
      }

      alert(
        "生徒を登録しました"
      );

      navigate("/students");
    };


  return (
    <div>

      <header>

        <div>
          <h2>
            生徒登録
          </h2>

          <p>
            新しい生徒の情報を登録します
          </p>
        </div>

      </header>


      <section className="content-card">

        <form
          className="student-form"
          onSubmit={
            handleSubmit
          }
        >

          <div className="form-group">

            <label>
              プレイヤー名
            </label>

            <input
              type="text"
              name="name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          <div className="form-group">

            <label>
              スト6 プレイヤーID
            </label>

            <input
              type="text"
              name="playerId"
              value={
                form.playerId
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          <div className="form-group">

            <label>
              担当コーチ
            </label>

            <select
              name="coach"
              value={
                form.coach
              }
              onChange={
                handleChange
              }
              disabled={
                loadingCoaches
              }
            >

              <option value="">
                {loadingCoaches
                  ? "読み込み中..."
                  : "担当コーチを選択してください"}
              </option>

              {coaches.map(
                (coach) => (
                  <option
                    key={
                      coach.id
                    }
                    value={
                      coach.name
                    }
                  >
                    {coach.name}
                  </option>
                )
              )}

            </select>

          </div>


          <div className="form-group">

            <label>
              使用キャラクター
            </label>

            <input
              type="text"
              name="character"
              value={
                form.character
              }
              onChange={
                handleChange
              }
            />

          </div>


          <div className="form-group">

            <label>
              ランク
            </label>

            <select
              name="rank"
              value={
                form.rank
              }
              onChange={
                handleChange
              }
            >

              <option value="">
                選択してください
              </option>

              {RANK_OPTIONS.map(
                (rank) => (
                  <option
                    key={rank}
                    value={rank}
                  >
                    {rank}
                  </option>
                )
              )}

            </select>

          </div>


          <div className="form-group">

            <label>
              MR
            </label>

            <input
              type="number"
              name="mr"
              value={
                form.mr
              }
              onChange={
                handleChange
              }
            />

          </div>


          <div className="form-group">

            <label>
              目標
            </label>

            <textarea
              name="goal"
              value={
                form.goal
              }
              onChange={
                handleChange
              }
              rows="3"
            />

          </div>


          <div className="form-group">

            <label>
              コーチング要望
            </label>

            <textarea
              name="request"
              value={
                form.request
              }
              onChange={
                handleChange
              }
              rows="4"
            />

          </div>


          <div className="form-group">

            <label>
              ゲームをプレイできる時間
            </label>

            <textarea
              name="gameAvailability"
              value={
                form.gameAvailability
              }
              onChange={
                handleChange
              }
              rows="3"
            />

          </div>


          <div className="form-group">

            <label>
              コーチングを受けられる時間
            </label>

            <textarea
              name="coachingAvailability"
              value={
                form.coachingAvailability
              }
              onChange={
                handleChange
              }
              rows="3"
            />

          </div>


          <div className="form-group">

            <label>
              現在の課題
            </label>

            <textarea
              name="task"
              value={
                form.task
              }
              onChange={
                handleChange
              }
              rows="3"
            />

          </div>


          {errorMessage && (
            <p className="error-message">
              登録に失敗しました：
              {errorMessage}
            </p>
          )}


          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate(
                  "/students"
                )
              }
            >
              キャンセル
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={
                saving ||
                loadingCoaches
              }
            >
              {saving
                ? "登録中..."
                : "登録する"}
            </button>

          </div>

        </form>

      </section>

    </div>
  );
}


export default StudentNew;