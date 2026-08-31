import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../../lib/supabase";


function StudentProfileDetails({
  student,
  onUpdated,
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
    errorMessage,
    setErrorMessage,
  ] = useState("");


  const [
    formData,
    setFormData,
  ] = useState({
    goal: "",
    request: "",
    game_availability: "",
    coaching_availability: "",
  });


  useEffect(() => {
    setFormData({
      goal:
        student.goal || "",

      request:
        student.request || "",

      game_availability:
        student.game_availability || "",

      coaching_availability:
        student.coaching_availability || "",
    });
  }, [student]);


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


  function handleEdit() {
    setFormData({
      goal:
        student.goal || "",

      request:
        student.request || "",

      game_availability:
        student.game_availability || "",

      coaching_availability:
        student.coaching_availability || "",
    });


    setErrorMessage("");

    setEditing(true);
  }


  function handleCancel() {
    setFormData({
      goal:
        student.goal || "",

      request:
        student.request || "",

      game_availability:
        student.game_availability || "",

      coaching_availability:
        student.coaching_availability || "",
    });


    setErrorMessage("");

    setEditing(false);
  }


  async function handleSave() {
    if (!student?.id) {
      setErrorMessage(
        "生徒情報が取得できません。"
      );

      return;
    }


    try {
      setSaving(true);

      setErrorMessage("");


      const updateData = {
        goal:
          formData.goal.trim(),

        request:
          formData.request.trim(),

        game_availability:
          formData.game_availability.trim(),

        coaching_availability:
          formData.coaching_availability.trim(),
      };


      const {
        data,
        error,
      } =
        await supabase
          .from("students")
          .update(
            updateData
          )
          .eq(
            "id",
            student.id
          )
          .select()
          .maybeSingle();


      if (error) {
        throw error;
      }


      if (!data) {
        throw new Error(
          "更新した生徒情報を取得できませんでした。"
        );
      }


      if (onUpdated) {
        onUpdated(
          data
        );
      }


      setEditing(false);

    } catch (error) {
      console.error(
        "プロフィール詳細更新エラー:",
        error
      );


      setErrorMessage(
        error.message ||
        "プロフィールの更新に失敗しました。"
      );

    } finally {
      setSaving(false);
    }
  }


  return (
    <>

      {errorMessage && (

        <p className="error-message">
          {errorMessage}
        </p>

      )}


      {/* =========================
          目標
      ========================= */}

      <section className="content-card">

        <div className="section-title student-profile-detail-title">

          <h3>
            目標
          </h3>


          {!editing && (

            <button
              type="button"
              className="student-profile-edit-button"
              onClick={
                handleEdit
              }
            >
              編集
            </button>

          )}

        </div>


        {editing ? (

          <textarea
            name="goal"
            className="student-profile-detail-textarea"
            value={
              formData.goal
            }
            onChange={
              handleChange
            }
            placeholder="例：MASTERに到達する"
            rows="3"
          />

        ) : (

          <p className="student-profile-detail-value">
            {student.goal ||
              "未設定"}
          </p>

        )}

      </section>


      {/* =========================
          コーチング要望
      ========================= */}

      <section className="content-card">

        <div className="section-title student-profile-detail-title">

          <h3>
            コーチング要望
          </h3>


          {!editing && (

            <button
              type="button"
              className="student-profile-edit-button"
              onClick={
                handleEdit
              }
            >
              編集
            </button>

          )}

        </div>


        {editing ? (

          <textarea
            name="request"
            className="student-profile-detail-textarea"
            value={
              formData.request
            }
            onChange={
              handleChange
            }
            placeholder="例：攻め方とコンボ選択を教えてほしい"
            rows="4"
          />

        ) : (

          <p className="student-profile-detail-value">
            {student.request ||
              "未設定"}
          </p>

        )}

      </section>


      {/* =========================
          ゲームをプレイできる時間
      ========================= */}

      <section className="content-card">

        <div className="section-title student-profile-detail-title">

          <h3>
            ゲームをプレイできる時間
          </h3>


          {!editing && (

            <button
              type="button"
              className="student-profile-edit-button"
              onClick={
                handleEdit
              }
            >
              編集
            </button>

          )}

        </div>


        {editing ? (

          <textarea
            name="game_availability"
            className="student-profile-detail-textarea"
            value={
              formData.game_availability
            }
            onChange={
              handleChange
            }
            placeholder="例：火・木 20:00〜23:00、日 15:00〜22:00"
            rows="3"
          />

        ) : (

          <p className="student-profile-detail-value">
            {
              student.game_availability ||
              "未設定"
            }
          </p>

        )}

      </section>


      {/* =========================
          コーチングを受けられる時間
      ========================= */}

      <section className="content-card">

        <div className="section-title student-profile-detail-title">

          <h3>
            コーチングを受けられる時間
          </h3>


          {!editing && (

            <button
              type="button"
              className="student-profile-edit-button"
              onClick={
                handleEdit
              }
            >
              編集
            </button>

          )}

        </div>


        {editing ? (

          <textarea
            name="coaching_availability"
            className="student-profile-detail-textarea"
            value={
              formData.coaching_availability
            }
            onChange={
              handleChange
            }
            placeholder="例：木 20:00〜22:00、日 16:00〜19:00"
            rows="3"
          />

        ) : (

          <p className="student-profile-detail-value">
            {
              student.coaching_availability ||
              "未設定"
            }
          </p>

        )}

      </section>


      {/* =========================
          保存
      ========================= */}

      {editing && (

        <div className="student-profile-detail-actions">

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
            type="button"
            className="primary-button"
            onClick={
              handleSave
            }
            disabled={
              saving
            }
          >
            {saving
              ? "保存中..."
              : "変更を保存"}
          </button>

        </div>

      )}

    </>
  );
}


export default StudentProfileDetails;