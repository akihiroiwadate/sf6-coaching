import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  supabase,
} from "../supabase";

import CoachCalendar
  from "../components/CoachCalendar";

import "../styles/student/student.css";
import "../styles/student/student-apply.css";
import "../styles/coaching-time.css";


const SESSION_DURATION_MINUTES =
  60;

const SLOT_INTERVAL_MINUTES =
  30;

const BUSINESS_START_HOUR =
  9;

const BUSINESS_END_HOUR =
  22;


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


function getTodayValue() {
  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function timeToMinutes(
  time
) {
  if (!time) {
    return 0;
  }

  const [
    hour,
    minute,
  ] = time
    .slice(0, 5)
    .split(":")
    .map(Number);

  return (
    hour * 60 +
    minute
  );
}


function minutesToTime(
  minutes
) {
  const hour =
    Math.floor(
      minutes / 60
    );

  const minute =
    minutes % 60;

  return (
    `${String(hour).padStart(
      2,
      "0"
    )}:${String(minute).padStart(
      2,
      "0"
    )}`
  );
}


function createTimeSlots() {
  const result = [];

  const start =
    BUSINESS_START_HOUR *
    60;

  const end =
    BUSINESS_END_HOUR *
    60;


  for (
    let current = start;
    current +
      SESSION_DURATION_MINUTES <=
      end;
    current +=
      SLOT_INTERVAL_MINUTES
  ) {
    result.push(
      minutesToTime(
        current
      )
    );
  }


  return result;
}


function scheduleConflictsWithSlot(
  schedule,
  slotTime
) {
  if (
    schedule.all_day
  ) {
    return true;
  }


  if (
    !schedule.start_time ||
    !schedule.end_time
  ) {
    return false;
  }


  const slotStart =
    timeToMinutes(
      slotTime
    );

  const slotEnd =
    slotStart +
    SESSION_DURATION_MINUTES;

  const scheduleStart =
    timeToMinutes(
      schedule.start_time
    );

  const scheduleEnd =
    timeToMinutes(
      schedule.end_time
    );


  return (
    slotStart <
      scheduleEnd &&
    slotEnd >
      scheduleStart
  );
}


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
    coaches,
    setCoaches,
  ] = useState([]);

  const [
    coachId,
    setCoachId,
  ] = useState("free");

  const [
    schedules,
    setSchedules,
  ] = useState([]);

  const [
    coachesLoading,
    setCoachesLoading,
  ] = useState(true);

  const [
    schedulesLoading,
    setSchedulesLoading,
  ] = useState(true);

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


  const today =
    getTodayValue();

  const timeSlots =
    useMemo(
      () =>
        createTimeSlots(),
      []
    );


  useEffect(() => {
    fetchInitialData();
  }, []);


  async function fetchInitialData() {
    setCoachesLoading(true);
    setSchedulesLoading(true);


    const [
      coachesResult,
      schedulesResult,
    ] =
      await Promise.all([
        supabase
          .from("coaches")
          .select(
            "id, name"
          )
          .order(
            "name",
            {
              ascending: true,
            }
          ),

        supabase
          .from(
            "coach_schedules"
          )
          .select(
            `
              id,
              coach_id,
              schedule_date,
              start_time,
              end_time,
              all_day
            `
          )
          .gte(
            "schedule_date",
            today
          ),
      ]);


    if (
      coachesResult.error
    ) {
      console.error(
        "コーチ一覧取得エラー:",
        coachesResult.error
      );

      setError(
        `コーチ一覧の取得に失敗しました：${coachesResult.error.message}`
      );

      setCoaches([]);
    } else {
      setCoaches(
        coachesResult.data ??
        []
      );
    }


    if (
      schedulesResult.error
    ) {
      console.error(
        "予定取得エラー:",
        schedulesResult.error
      );

      setError(
        `コーチ予定の取得に失敗しました：${schedulesResult.error.message}`
      );

      setSchedules([]);
    } else {
      setSchedules(
        schedulesResult.data ??
        []
      );
    }


    setCoachesLoading(false);
    setSchedulesLoading(false);
  }


  const selectedCoach =
    useMemo(() => {
      if (
        coachId === "free"
      ) {
        return null;
      }

      return coaches.find(
        (coach) =>
          String(coach.id) ===
          String(coachId)
      );
    }, [
      coaches,
      coachId,
    ]);


  function getCoachSchedulesForDate(
    targetCoachId,
    date
  ) {
    return schedules.filter(
      (schedule) =>
        String(
          schedule.coach_id
        ) ===
          String(
            targetCoachId
          ) &&
        schedule.schedule_date ===
          date
    );
  }


  function isCoachAvailableAt(
    targetCoachId,
    date,
    time
  ) {
    const coachSchedules =
      getCoachSchedulesForDate(
        targetCoachId,
        date
      );


    return !coachSchedules.some(
      (schedule) =>
        scheduleConflictsWithSlot(
          schedule,
          time
        )
    );
  }


  function isTimeDisabled(
    time
  ) {
    if (!preferredDate) {
      return true;
    }


    if (
      coachId !== "free"
    ) {
      return !isCoachAvailableAt(
        coachId,
        preferredDate,
        time
      );
    }


    if (
      coaches.length === 0
    ) {
      return true;
    }


    const hasAvailableCoach =
      coaches.some(
        (coach) =>
          isCoachAvailableAt(
            coach.id,
            preferredDate,
            time
          )
      );


    return !hasAvailableCoach;
  }


  const disabledDates =
    useMemo(() => {
      if (
        coachId !== "free"
      ) {
        return [
          ...new Set(
            schedules
              .filter(
                (schedule) =>
                  String(
                    schedule.coach_id
                  ) ===
                    String(
                      coachId
                    ) &&
                  schedule.all_day
              )
              .map(
                (schedule) =>
                  schedule.schedule_date
              )
          ),
        ];
      }


      if (
        coaches.length === 0
      ) {
        return [];
      }


      const allDayDates =
        new Map();


      schedules
        .filter(
          (schedule) =>
            schedule.all_day
        )
        .forEach(
          (schedule) => {
            if (
              !allDayDates.has(
                schedule.schedule_date
              )
            ) {
              allDayDates.set(
                schedule.schedule_date,
                new Set()
              );
            }


            allDayDates
              .get(
                schedule.schedule_date
              )
              .add(
                String(
                  schedule.coach_id
                )
              );
          }
        );


      const result = [];


      allDayDates.forEach(
        (
          unavailableCoachIds,
          date
        ) => {
          const allUnavailable =
            coaches.every(
              (coach) =>
                unavailableCoachIds.has(
                  String(
                    coach.id
                  )
                )
            );


          if (
            allUnavailable
          ) {
            result.push(
              date
            );
          }
        }
      );


      return result;

    }, [
      coachId,
      coaches,
      schedules,
    ]);


  useEffect(() => {
    setPreferredTime("");

    if (
      preferredDate &&
      disabledDates.includes(
        preferredDate
      )
    ) {
      setPreferredDate("");
    }
  }, [
    coachId,
    disabledDates,
  ]);


  useEffect(() => {
    if (
      preferredTime &&
      isTimeDisabled(
        preferredTime
      )
    ) {
      setPreferredTime("");
    }
  }, [
    preferredDate,
    schedules,
  ]);


  const availableTimeCount =
    useMemo(() => {
      if (!preferredDate) {
        return 0;
      }

      return timeSlots.filter(
        (time) =>
          !isTimeDisabled(
            time
          )
      ).length;
    }, [
      preferredDate,
      coachId,
      coaches,
      schedules,
      timeSlots,
    ]);


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


  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [
    previewUrl,
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


    if (
      coachingType !==
        "replay" &&
      !preferredDate
    ) {
      setError(
        "希望日を選択してください。"
      );

      return;
    }


    if (
      coachingType !==
        "replay" &&
      !preferredTime
    ) {
      setError(
        "希望時間を選択してください。"
      );

      return;
    }


    if (
      preferredDate &&
      disabledDates.includes(
        preferredDate
      )
    ) {
      setError(
        "選択した日はコーチが対応できません。別の日を選択してください。"
      );

      return;
    }


    if (
      preferredTime &&
      isTimeDisabled(
        preferredTime
      )
    ) {
      setError(
        "選択した時間はコーチが対応できません。別の時間を選択してください。"
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

            coach_id:
              coachId === "free"
                ? null
                : Number(
                    coachId
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
        `申し込みに失敗しました：${
          err?.message ||
          "原因不明のエラー"
        }`
      );

    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="coaching-apply-page">

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
                    onChange={() => {
                      setCoachingType(
                        type.value
                      );

                      if (
                        type.value ===
                        "replay"
                      ) {
                        setPreferredTime(
                          ""
                        );
                      }
                    }}
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


        <section className="coaching-apply-section">

          <div className="apply-section-heading">

            <span className="apply-section-number">
              2
            </span>

            <div>

              <h3>
                希望コーチ
              </h3>

              <p>
                コーチを指定するか、
                フリーで申し込めます
              </p>

            </div>

          </div>


          <div className="form-group">

            <label htmlFor="coachId">
              希望コーチ
            </label>


            <select
              id="coachId"
              value={
                coachId
              }
              disabled={
                coachesLoading
              }
              onChange={(event) => {
                setCoachId(
                  event.target.value
                );

                setPreferredTime(
                  ""
                );
              }}
            >

              <option value="free">
                フリー（コーチ指定なし）
              </option>


              {coaches.map(
                (coach) => (

                  <option
                    key={
                      coach.id
                    }
                    value={
                      coach.id
                    }
                  >
                    {coach.name}
                  </option>

                )
              )}

            </select>

          </div>


          {coachId === "free" ? (

            <p className="apply-note">
              対応可能なコーチが
              申し込みを確認します
            </p>

          ) : selectedCoach ? (

            <p className="apply-note">

              選択中：

              <strong>
                {selectedCoach.name}
              </strong>

            </p>

          ) : null}

        </section>


        <section className="coaching-apply-section">

          <div className="apply-section-heading">

            <span className="apply-section-number">
              3
            </span>

            <div>

              <h3>
                希望日時
              </h3>

              <p>
                コーチが対応できる
                日時から選択してください
              </p>

            </div>

          </div>


          {schedulesLoading ? (

            <p>
              コーチの予定を
              確認しています...
            </p>

          ) : (

            <CoachCalendar
              value={
                preferredDate
              }
              onChange={(date) => {
                setPreferredDate(
                  date
                );

                setPreferredTime(
                  ""
                );
              }}
              disabledDates={
                disabledDates
              }
              minDate={
                today
              }
            />

          )}


          {preferredDate && (
            <div className="selected-schedule-date">

              希望日：

              <strong>
                {preferredDate}
              </strong>

            </div>
          )}


          {preferredDate &&
            coachingType !==
              "replay" && (

            <div className="coaching-time-area">

              <label>
                希望時間
              </label>


              {availableTimeCount ===
              0 ? (

                <div className="coaching-time-empty">
                  この日は対応可能な時間がありません
                </div>

              ) : (

                <div className="coaching-time-grid">

                  {timeSlots.map(
                    (time) => {
                      const disabled =
                        isTimeDisabled(
                          time
                        );

                      const selected =
                        preferredTime ===
                        time;


                      return (
                        <button
                          key={
                            time
                          }
                          type="button"
                          disabled={
                            disabled
                          }
                          className={
                            `coaching-time-button ${
                              selected
                                ? "selected"
                                : ""
                            }`
                          }
                          onClick={() =>
                            setPreferredTime(
                              time
                            )
                          }
                        >
                          {time}
                        </button>
                      );
                    }
                  )}

                </div>

              )}


              {preferredTime && (

                <p className="coaching-time-selected">

                  選択中：

                  <strong>
                    {preferredTime}
                  </strong>

                  〜

                  <strong>
                    {minutesToTime(
                      timeToMinutes(
                        preferredTime
                      ) +
                        SESSION_DURATION_MINUTES
                    )}
                  </strong>

                </p>

              )}

            </div>

          )}


          {coachingType ===
            "replay" && (

            <p className="apply-note">
              リプレイのみの場合は、
              希望日時なしでも申し込めます
            </p>

          )}

        </section>


        <section className="coaching-apply-section">

          <div className="apply-section-heading">

            <span className="apply-section-number">
              4
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
                  event.target.value
                )
              }
            />


            <div className="input-counter">
              {request.length}
              文字
            </div>

          </div>

        </section>


        <section className="coaching-apply-section">

          <div className="apply-section-heading">

            <span className="apply-section-number">
              5
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
                    event.target.value
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
              submitting ||
              coachesLoading ||
              schedulesLoading
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