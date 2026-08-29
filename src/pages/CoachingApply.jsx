import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  supabase,
} from "../supabase";

import "../styles/student.css";


const COACHING_TYPES = [
  {
    value: "online",
    label: "オンライン",
    description:
      "オンラインでリアルタイムにコーチングを受けます",
  },
  {
    value: "offline",
    label: "オフライン",
    description:
      "対面でコーチングを受けます",
  },
  {
    value: "replay",
    label: "リプレイのみ",
    description:
      "リプレイを確認してもらいアドバイスを受けます",
  },
];


function CoachingApply() {
  const navigate =
    useNavigate();

  const studentId =
    localStorage.getItem(
      "studentId"
    );


  const [
    coachingType,
    setCoachingType,
  ] = useState("online");

  const [
    preferredDate,
    setPreferredDate,
  ] = useState("");

  const [
    preferredTime,
    setPreferredTime,
  ] = useState("");

  const [
    request,
    setRequest,
  ] = useState("");

  const [
    replayId,
    setReplayId,
  ] = useState("");

  const [
    replayImage,
    setReplayImage,
  ] = useState(null);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  const previewUrl =
    useMemo(() => {
      if (!replayImage) {
        return null;
      }

      return URL.createObjectURL(
        replayImage
      );
    }, [
      replayImage,
    ]);


  function handleImageChange(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      setReplayImage(null);
      return;
    }

    setReplayImage(file);
  }


  async function uploadReplayImage() {
    if (!replayImage) {
      return null;
    }

    const extension =
      replayImage.name
        .split(".")
        .pop();

    const fileName =
      `${Date.now()}-${studentId}.${extension}`;

    const path =
      `${studentId}/${fileName}`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from(
          "coaching-replay-images"
        )
        .upload(
          path,
          replayImage
        );

    if (uploadError) {
      throw uploadError;
    }

    return path;
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setError("");


    if (!studentId) {
      setError(
        "生徒情報を取得できません。もう一度ログインしてください。"
      );

      return;
    }


    if (!request.trim()) {
      setError(
        "相談したいことを入力してください。"
      );

      return;
    }


    if (
      coachingType ===
        "replay" &&
      !replayId.trim()
    ) {
      setError(
        "リプレイのみの場合は、リプレイIDを入力してください。"
      );

      return;
    }


    try {
      setSubmitting(true);

      let replayImagePath =
        null;


      if (replayImage) {
        replayImagePath =
          await uploadReplayImage();
      }


      const {
        error: insertError,
      } =
        await supabase
          .from(
            "coaching_requests"
          )
          .insert({
            student_id:
              Number(
                studentId
              ),

            coaching_type:
              coachingType,

            preferred_date:
              preferredDate ||
              null,

            preferred_time:
              preferredTime ||
              null,

            request:
              request.trim(),

            replay_id:
              replayId.trim() ||
              null,

            replay_image_path:
              replayImagePath,

            status:
              "pending",
          });


      if (insertError) {
        throw insertError;
      }


      window.alert(
        "コーチングを申し込みました。"
      );


      navigate(
        `/mypage/${studentId}`
      );

    } catch (err) {
      console.error(
        "コーチング申し込みエラー:",
        err
      );


      setError(
        `申し込みに失敗しました。${
          err?.message
            ? ` ${err.message}`
            : ""
        }`
      );

    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="coaching-apply-page">

      {/* =====================
          Header
      ===================== */}

      <header className="coaching-apply-header">

        <div>

          <span className="page-eyebrow">
            COACHING REQUEST
          </span>

          <h2>
            コーチング申し込み
          </h2>

          <p>
            希望するコーチング内容を
            入力してください
          </p>

        </div>


        <button
          type="button"
          className="cancel-button"
          onClick={() =>
            navigate(
              `/mypage/${studentId}`
            )
          }
        >
          戻る
        </button>

      </header>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      <form
        className="coaching-apply-form"
        onSubmit={
          handleSubmit
        }
      >

        {/* =====================
            Coaching Type
        ===================== */}

        <section className="coaching-apply-section">

          <div className="apply-section-heading">

            <span className="apply-section-number">
              1
            </span>

            <div>
              <h3>
                コーチングの種類
              </h3>

              <p>
                受けたい方法を
                選んでください
              </p>
            </div>

          </div>


          <div className="coaching-type-grid">

            {COACHING_TYPES.map(
              (type) => (
                <label
                  key={
                    type.value
                  }
                  className={
                    `coaching-type-card ${
                      coachingType ===
                      type.value
                        ? "selected"
                        : ""
                    }`
                  }
                >

                  <input
                    type="radio"
                    name="coachingType"
                    value={
                      type.value
                    }
                    checked={
                      coachingType ===
                      type.value
                    }
                    onChange={() =>
                      setCoachingType(
                        type.value
                      )
                    }
                  />


                  <div className="coaching-type-radio">
                    <span />
                  </div>


                  <div className="coaching-type-text">

                    <strong>
                      {type.label}
                    </strong>

                    <p>
                      {
                        type.description
                      }
                    </p>

                  </div>

                </label>
              )
            )}

          </div>

        </section>


        {/* =====================
            Date
        ===================== */}

        <section className="coaching-apply-section">

          <div className="apply-section-heading">

            <span className="apply-section-number">
              2
            </span>

            <div>
              <h3>
                希望日時
              </h3>

              <p>
                希望する日時を
                入力してください
              </p>
            </div>

          </div>


          <div className="coaching-date-grid">

            <div className="form-group">

              <label htmlFor="preferredDate">
                希望日
              </label>

              <input
                id="preferredDate"
                type="date"
                value={
                  preferredDate
                }
                onChange={(event) =>
                  setPreferredDate(
                    event.target
                      .value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label htmlFor="preferredTime">
                希望時間
              </label>

              <input
                id="preferredTime"
                type="time"
                value={
                  preferredTime
                }
                onChange={(event) =>
                  setPreferredTime(
                    event.target
                      .value
                  )
                }
              />

            </div>

          </div>


          {coachingType ===
            "replay" && (
            <p className="apply-note">
              リプレイのみの場合、
              希望日時は未入力でも
              申し込めます。
            </p>
          )}

        </section>


        {/* =====================
            Request
        ===================== */}

        <section className="coaching-apply-section">

          <div className="apply-section-heading">

            <span className="apply-section-number">
              3
            </span>

            <div>
              <h3>
                相談したいこと
              </h3>

              <p>
                見てほしいポイントや
                困っていることを
                入力してください
              </p>
            </div>

          </div>


          <div className="form-group">

            <label htmlFor="request">
              相談内容
              <span className="required-label">
                必須
              </span>
            </label>


            <textarea
              id="request"
              className="coaching-request-textarea"
              value={
                request
              }
              placeholder="例：対空が間に合わないことが多いので、改善するポイントを教えてほしいです"
              onChange={(event) =>
                setRequest(
                  event.target
                    .value
                )
              }
            />


            <div className="input-counter">
              {request.length}
              文字
            </div>

          </div>

        </section>


        {/* =====================
            Replay
        ===================== */}

        <section className="coaching-apply-section">

          <div className="apply-section-heading">

            <span className="apply-section-number">
              4
            </span>

            <div>
              <h3>
                リプレイ
              </h3>

              <p>
                確認してほしい試合が
                ある場合は入力してください
              </p>
            </div>

          </div>


          <div className="replay-area">

            <div className="form-group">

              <label htmlFor="replayId">
                リプレイID

                {coachingType ===
                  "replay" && (
                  <span className="required-label">
                    必須
                  </span>
                )}
              </label>


              <input
                id="replayId"
                type="text"
                value={
                  replayId
                }
                placeholder="リプレイIDを入力"
                onChange={(event) =>
                  setReplayId(
                    event.target
                      .value
                  )
                }
              />

            </div>


            <div className="replay-image-area">

              <div className="replay-upload-box">

                <strong>
                  リプレイIDの写真
                </strong>

                <p>
                  スマホで撮影した
                  リプレイIDの画面を
                  選択できます
                </p>


                <label className="replay-file-button">

                  写真を選択

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={
                      handleImageChange
                    }
                  />

                </label>


                {replayImage && (
                  <small>
                    {
                      replayImage.name
                    }
                  </small>
                )}

              </div>


              {previewUrl ? (
                <div className="replay-preview">

                  <img
                    src={
                      previewUrl
                    }
                    alt="リプレイIDのプレビュー"
                  />

                </div>
              ) : (
                <div className="replay-preview-empty">
                  写真を選択すると
                  ここに表示されます
                </div>
              )}

            </div>

          </div>

        </section>


        {/* =====================
            Actions
        ===================== */}

        <div className="coaching-apply-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              navigate(
                `/mypage/${studentId}`
              )
            }
          >
            キャンセル
          </button>


          <button
            type="submit"
            className="primary-button"
            disabled={
              submitting
            }
          >
            {submitting
              ? "申し込み中..."
              : "この内容で申し込む"}
          </button>

        </div>

      </form>

    </div>
  );
}


export default CoachingApply;