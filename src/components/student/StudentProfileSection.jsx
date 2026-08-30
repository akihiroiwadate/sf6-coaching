import {
  useState,
} from "react";

import {
  supabase,
} from "../../supabase";

import {
  RANK_OPTIONS,
} from "../../constants/ranks";


function createFormData(
  student
) {
  return {
    name:
      student?.name || "",

    player_id:
      student?.player_id || "",

    character:
      student?.character || "",

    rank:
      student?.rank || "",

    mr:
      student?.mr ?? "",

    goal:
      student?.goal || "",

    request:
      student?.request || "",

    game_availability:
      student?.game_availability ||
      "",

    coaching_availability:
      student?.coaching_availability ||
      "",
  };
}


function StudentProfileSection({
  student,
  onUpdated,
  onSuccess,
  onError,
}) {
  const [
    editing,
    setEditing,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState(
    createFormData(student)
  );


  function resetForm() {
    setFormData(
      createFormData(student)
    );
  }


  function handleStartEdit() {
    resetForm();

    setEditing(true);
  }


  function handleCancel() {
    resetForm();

    setEditing(false);
  }


  function handleChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  }


  async function handleSave(
    event
  ) {
    event.preventDefault();

    if (
      !formData.name.trim()
    ) {
      onError?.(
        "プレイヤー名を入力してください。"
      );

      return;
    }

    try {
      setSaving(true);

      const {
        data,
        error,
      } = await supabase
        .from("students")
        .update({
          name:
            formData.name.trim(),

          player_id:
            formData
              .player_id
              .trim() ||
            null,

          character:
            formData
              .character
              .trim() ||
            null,

          rank:
            formData.rank ||
            null,

          mr:
            formData.mr === ""
              ? null
              : Number(
                  formData.mr
                ),

          goal:
            formData
              .goal
              .trim() ||
            null,

          request:
            formData
              .request
              .trim() ||
            null,

          game_availability:
            formData
              .game_availability
              .trim() ||
            null,

          coaching_availability:
            formData
              .coaching_availability
              .trim() ||
            null,
        })
        .eq(
          "id",
          student.id
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      onUpdated?.(data);

      const loginStudentId =
        localStorage.getItem(
          "studentId"
        );

      if (
        String(data.id) ===
        String(loginStudentId)
      ) {
        localStorage.setItem(
          "studentName",
          data.name
        );
      }

      setEditing(false);

      onSuccess?.(
        "パーソナル情報を保存しました。"
      );

    } catch (error) {
      console.error(
        "パーソナル情報更新エラー:",
        error
      );

      onError?.(
        error.message ||
          "パーソナル情報の保存に失敗しました。"
      );

    } finally {
      setSaving(false);
    }
  }


  return (
    <section className="content-card">

      <div className="section-title">

        <div>

          <h3>
            パーソナル情報
          </h3>

          <p>
            スト6のプレイヤー情報や
            コーチング希望を管理します
          </p>

        </div>


        {!editing && (
          <button
            type="button"
            className="primary-button"
            onClick={
              handleStartEdit
            }
          >
            編集する
          </button>
        )}

      </div>


      {editing ? (

        <form
          className="student-form"
          onSubmit={
            handleSave
          }
        >

          <div className="form-grid">

            <div className="form-group">

              <label>
                プレイヤー名
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
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
                name="player_id"
                value={
                  formData.player_id
                }
                onChange={
                  handleChange
                }
              />

            </div>


            <div className="form-group">

              <label>
                使用キャラクター
              </label>

              <input
                type="text"
                name="character"
                value={
                  formData.character
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
                  formData.rank
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
                  formData.mr
                }
                onChange={
                  handleChange
                }
                min="0"
              />

            </div>

          </div>


          <div className="form-group">

            <label>
              目標
            </label>

            <textarea
              name="goal"
              value={
                formData.goal
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
                formData.request
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
              name="game_availability"
              value={
                formData
                  .game_availability
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
              name="coaching_availability"
              value={
                formData
                  .coaching_availability
              }
              onChange={
                handleChange
              }
              rows="3"
            />

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={
                handleCancel
              }
              disabled={
                saving
              }
            >
              キャンセル
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={
                saving
              }
            >
              {saving
                ? "保存中..."
                : "保存する"}
            </button>

          </div>

        </form>

      ) : (

        <div className="student-detail-grid">

          <div>
            <span className="detail-label">
              プレイヤー名
            </span>

            <strong>
              {student.name || "-"}
            </strong>
          </div>


          <div>
            <span className="detail-label">
              スト6 プレイヤーID
            </span>

            <strong>
              {student.player_id ||
                "-"}
            </strong>
          </div>


          <div>
            <span className="detail-label">
              担当コーチ
            </span>

            <strong>
              {student.coach ||
                "未設定"}
            </strong>
          </div>


          <div>
            <span className="detail-label">
              使用キャラクター
            </span>

            <strong>
              {student.character ||
                "-"}
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
              目標
            </span>

            <strong>
              {student.goal || "-"}
            </strong>
          </div>


          <div>
            <span className="detail-label">
              コーチング要望
            </span>

            <strong>
              {student.request ||
                "-"}
            </strong>
          </div>


          <div>
            <span className="detail-label">
              ゲームをプレイできる時間
            </span>

            <strong>
              {student
                .game_availability ||
                "-"}
            </strong>
          </div>


          <div>
            <span className="detail-label">
              コーチングを受けられる時間
            </span>

            <strong>
              {student
                .coaching_availability ||
                "-"}
            </strong>
          </div>

        </div>

      )}

    </section>
  );
}


export default StudentProfileSection;