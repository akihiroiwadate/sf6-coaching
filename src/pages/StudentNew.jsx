import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  supabase,
} from "../supabase";


function StudentNew() {
  const navigate =
    useNavigate();


  const [
    form,
    setForm,
  ] = useState({
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


  const [
    coaches,
    setCoaches,
  ] = useState([]);


  const [
    loadingCoaches,
    setLoadingCoaches,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  useEffect(() => {
    fetchCoaches();
  }, []);


  async function fetchCoaches() {
    try {
      setLoadingCoaches(true);

      const {
        data,
        error,
      } =
        await supabase
          .from("coaches")
          .select("id, name")
          .order("name", {
            ascending: true,
          });


      if (error) {
        throw error;
      }


      setCoaches(
        data || []
      );

    } catch (error) {
      console.error(
        "コーチ一覧取得エラー:",
        error
      );

      setErrorMessage(
        "コーチ一覧の取得に失敗しました。"
      );

    } finally {
      setLoadingCoaches(false);
    }
  }


  function handleChange(e) {
    const {
      name,
      value,
    } = e.target;


    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }


  async function handleSubmit(e) {
    e.preventDefault();


    setSaving(true);
    setErrorMessage("");


    try {
      const {
        error,
      } =
        await supabase
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
        throw error;
      }


      alert(
        "生徒を登録しました"
      );


      navigate(
        "/students"
      );

    } catch (error) {
      console.error(
        "登録エラー:",
        error
      );


      setErrorMessage(
        error.message ||
          "生徒の登録に失敗しました。"
      );

    } finally {
      setSaving(false);
    }
  }


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

          {/* =====================
              プレイヤー名
          ===================== */}

          <div className="form-group">

            <label htmlFor="name">
              プレイヤー名
            </label>

            <input
              id="name"
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


          {/* =====================
              プレイヤーID
          ===================== */}

          <div className="form-group">

            <label htmlFor="playerId">
              スト6 プレイヤーID
            </label>

            <input
              id="playerId"
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


          {/* =====================
              担当コーチ
          ===================== */}

          <div className="form-group">

            <label htmlFor="coach">
              担当コーチ
            </label>


            <select
              id="coach"
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
                  ? "コーチ一覧を読み込み中..."
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
                    {
                      coach.name
                    }
                  </option>
                )
              )}

            </select>


            {!loadingCoaches &&
              coaches.length === 0 && (
                <small>
                  登録されているコーチがいません
                </small>
              )}

          </div>


          {/* =====================
              使用キャラクター
          ===================== */}

          <div className="form-group">

            <label htmlFor="character">
              使用キャラクター
            </label>

            <input
              id="character"
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


          {/* =====================
              ランク
          ===================== */}

          <div className="form-group">

            <label htmlFor="rank">
              ランク
            </label>

            <select
              id="rank"
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

              <option value="ROOKIE">
                ROOKIE
              </option>

              <option value="IRON">
                IRON
              </option>

              <option value="BRONZE">
                BRONZE
              </option>

              <option value="SILVER">
                SILVER
              </option>

              <option value="GOLD">
                GOLD
              </option>

              <option value="PLATINUM">
                PLATINUM
              </option>

              <option value="DIAMOND">
                DIAMOND
              </option>

              <option value="MASTER">
                MASTER
              </option>

            </select>

          </div>


          {/* =====================
              MR
          ===================== */}

          <div className="form-group">

            <label htmlFor="mr">
              MR
            </label>

            <input
              id="mr"
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


          {/* =====================
              目標
          ===================== */}

          <div className="form-group">

            <label htmlFor="goal">
              目標
            </label>

            <textarea
              id="goal"
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


          {/* =====================
              コーチング要望
          ===================== */}

          <div className="form-group">

            <label htmlFor="request">
              コーチング要望
            </label>

            <textarea
              id="request"
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


          {/* =====================
              プレイ可能時間
          ===================== */}

          <div className="form-group">

            <label htmlFor="gameAvailability">
              ゲームをプレイできる時間
            </label>

            <textarea
              id="gameAvailability"
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


          {/* =====================
              コーチング可能時間
          ===================== */}

          <div className="form-group">

            <label htmlFor="coachingAvailability">
              コーチングを受けられる時間
            </label>

            <textarea
              id="coachingAvailability"
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


          {/* =====================
              現在の課題
          ===================== */}

          <div className="form-group">

            <label htmlFor="task">
              現在の課題
            </label>

            <textarea
              id="task"
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


          {/* =====================
              Error
          ===================== */}

          {errorMessage && (
            <p className="error-message">
              {errorMessage}
            </p>
          )}


          {/* =====================
              Actions
          ===================== */}

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