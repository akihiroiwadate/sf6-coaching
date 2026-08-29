import {
  useState,
} from "react";

import {
  supabase,
} from "../../supabase";


function StudentProfileSection({
  student,
  onUpdated,
  onSuccess,
  onError,
}) {
  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    formData,
    setFormData,
  ] = useState({
    name:
      student.name ?? "",

    player_id:
      student.player_id ?? "",

    character:
      student.character ?? "",

    rank:
      student.rank ?? "",

    mr:
      student.mr ?? "",

    goal:
      student.goal ?? "",

    request:
      student.request ?? "",

    game_availability:
      student.game_availability ??
      "",

    coaching_availability:
      student.coaching_availability ??
      "",
  });


  function resetForm() {
    setFormData({
      name:
        student.name ?? "",

      player_id:
        student.player_id ?? "",

      character:
        student.character ?? "",

      rank:
        student.rank ?? "",

      mr:
        student.mr ?? "",

      goal:
        student.goal ?? "",

      request:
        student.request ?? "",

      game_availability:
        student.game_availability ??
        "",

      coaching_availability:
        student.coaching_availability ??
        "",
    });
  }


  function handleChange(
    event
  ) {
    const {
      name,
      value,
    } =
      event.target;


    setFormData(
      (current) => ({
        ...current,
        [name]:
          value,
      })
    );
  }


  function handleStartEdit() {
    resetForm();

    setIsEditing(
      true
    );
  }


  function handleCancel() {
    resetForm();

    setIsEditing(
      false
    );
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault();


    if (
      !formData.name.trim()
    ) {
      onError(
        "プレイヤー名を入力してください。"
      );

      return;
    }


    let mrValue =
      null;


    if (
      formData.mr !== ""
    ) {
      mrValue =
        Number(
          formData.mr
        );


      if (
        Number.isNaN(
          mrValue
        )
      ) {
        onError(
          "MRは数字で入力してください。"
        );

        return;
      }
    }


    try {
      setSaving(
        true
      );


      const {
        data,
        error,
      } =
        await supabase
          .from("students")
          .update({
            name:
              formData.name.trim(),

            player_id:
              formData.player_id.trim() ||
              null,

            character:
              formData.character.trim() ||
              null,

            rank:
              formData.rank.trim() ||
              null,

            mr:
              mrValue,

            goal:
              formData.goal.trim() ||
              null,

            request:
              formData.request.trim() ||
              null,

            game_availability:
              formData.game_availability.trim() ||
              null,

            coaching_availability:
              formData.coaching_availability.trim() ||
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


      onUpdated(
        data
      );


      const loginStudentId =
        localStorage.getItem(
          "studentId"
        );


      if (
        String(
          student.id
        ) ===
        String(
          loginStudentId
        )
      ) {
        localStorage.setItem(
          "studentName",
          data.name
        );
      }


      setIsEditing(
        false
      );


      onSuccess(
        "パーソナル情報を保存しました。"
      );

    } catch (error) {
      console.error(
        "パーソナル情報更新エラー:",
        error
      );


      onError(
        `保存に失敗しました：${error.message}`
      );

    } finally {
      setSaving(
        false
      );
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


        {!isEditing && (
          <button
            type="button"
            className="cancel-button"
            onClick={
              handleStartEdit
            }
          >
            編集する
          </button>
        )}

      </div>


      {!isEditing ? (
        <>

          <div className="student-detail-grid">

            <div>
              <span className="detail-label">
                プレイヤー名
              </span>

              <strong>
                {student.name ||
                  "-"}
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
                {student.rank ||
                  "-"}
              </strong>
            </div>


            <div>
              <span className="detail-label">
                MR
              </span>

              <strong>
                {student.mr ??
                  "-"}
              </strong>
            </div>


            <div>
              <span className="detail-label">
                担当コーチ
              </span>

              <strong>
                {student.coach ||
                  "-"}
              </strong>
            </div>

          </div>


          <div
            style={{
              marginTop:
                "28px",
            }}
          >

            <div className="form-group">
              <span className="detail-label">
                目標
              </span>

              <p>
                {student.goal ||
                  "未設定"}
              </p>
            </div>


            <div className="form-group">
              <span className="detail-label">
                コーチング要望
              </span>

              <p>
                {student.request ||
                  "未設定"}
              </p>
            </div>


            <div className="form-group">
              <span className="detail-label">
                ゲームをプレイできる時間
              </span>

              <p>
                {student.game_availability ||
                  "未設定"}
              </p>
            </div>


            <div className="form-group">
              <span className="detail-label">
                コーチングを受けられる時間
              </span>

              <p>
                {student.coaching_availability ||
                  "未設定"}
              </p>
            </div>

          </div>

        </>
      ) : (

        <form
          className="student-form"
          onSubmit={
            handleSubmit
          }
        >

          <div className="student-detail-grid">

            <div className="form-group">

              <label htmlFor="name">
                プレイヤー名
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
              />

            </div>


            <div className="form-group">

              <label htmlFor="player_id">
                スト6 プレイヤーID
              </label>

              <input
                id="player_id"
                name="player_id"
                type="text"
                value={
                  formData.player_id
                }
                onChange={
                  handleChange
                }
              />

            </div>


            <div className="form-group">

              <label htmlFor="character">
                使用キャラクター
              </label>

              <input
                id="character"
                name="character"
                type="text"
                value={
                  formData.character
                }
                onChange={
                  handleChange
                }
              />

            </div>


            <div className="form-group">

              <label htmlFor="rank">
                ランク
              </label>

              <input
                id="rank"
                name="rank"
                type="text"
                value={
                  formData.rank
                }
                onChange={
                  handleChange
                }
              />

            </div>


            <div className="form-group">

              <label htmlFor="mr">
                MR
              </label>

              <input
                id="mr"
                name="mr"
                type="number"
                min="0"
                value={
                  formData.mr
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>


          <div className="form-group">

            <label htmlFor="goal">
              目標
            </label>

            <textarea
              id="goal"
              name="goal"
              rows="3"
              value={
                formData.goal
              }
              onChange={
                handleChange
              }
            />

          </div>


          <div className="form-group">

            <label htmlFor="request">
              コーチング要望
            </label>

            <textarea
              id="request"
              name="request"
              rows="4"
              value={
                formData.request
              }
              onChange={
                handleChange
              }
            />

          </div>


          <div className="form-group">

            <label htmlFor="game_availability">
              ゲームをプレイできる時間
            </label>

            <textarea
              id="game_availability"
              name="game_availability"
              rows="3"
              value={
                formData.game_availability
              }
              onChange={
                handleChange
              }
            />

          </div>


          <div className="form-group">

            <label htmlFor="coaching_availability">
              コーチングを受けられる時間
            </label>

            <textarea
              id="coaching_availability"
              name="coaching_availability"
              rows="3"
              value={
                formData.coaching_availability
              }
              onChange={
                handleChange
              }
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
      )}

    </section>
  );
}


export default StudentProfileSection;