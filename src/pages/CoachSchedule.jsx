import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../supabase";

import CoachCalendar
  from "../components/CoachCalendar";

import "../styles/coach-schedule.css";


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


function formatTime(
  time
) {
  if (!time) {
    return "";
  }

  return time.slice(
    0,
    5
  );
}


function CoachSchedule() {
  const coachId =
    localStorage.getItem(
      "coachId"
    );

  const coachName =
    localStorage.getItem(
      "coachName"
    );


  const [
    schedules,
    setSchedules,
  ] = useState([]);

  const [
    selectedDate,
    setSelectedDate,
  ] = useState("");

  const [
    allDay,
    setAllDay,
  ] = useState(false);

  const [
    startTime,
    setStartTime,
  ] = useState("10:00");

  const [
    endTime,
    setEndTime,
  ] = useState("11:00");

  const [
    memo,
    setMemo,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  const today =
    getTodayValue();


  useEffect(() => {
    if (!coachId) {
      setError(
        "コーチIDを取得できません。もう一度ログインしてください。"
      );

      setLoading(false);

      return;
    }

    fetchSchedules();
  }, [
    coachId,
  ]);


  async function fetchSchedules() {
    if (!coachId) {
      return;
    }


    setLoading(true);


    const {
      data,
      error: fetchError,
    } = await supabase
      .from(
        "coach_schedules"
      )
      .select("*")
      .eq(
        "coach_id",
        Number(
          coachId
        )
      )
      .gte(
        "schedule_date",
        today
      )
      .order(
        "schedule_date",
        {
          ascending: true,
        }
      )
      .order(
        "start_time",
        {
          ascending: true,
          nullsFirst: true,
        }
      );


    if (fetchError) {
      console.error(
        "予定取得エラー:",
        fetchError
      );

      setError(
        `予定の取得に失敗しました：${fetchError.message}`
      );

      setSchedules([]);
      setLoading(false);

      return;
    }


    setSchedules(
      data ?? []
    );

    setLoading(false);
  }


  function hasScheduleConflict() {
    const sameDaySchedules =
      schedules.filter(
        (schedule) =>
          schedule.schedule_date ===
          selectedDate
      );


    if (
      sameDaySchedules.some(
        (schedule) =>
          schedule.all_day
      )
    ) {
      return (
        "この日はすでに終日対応不可として登録されています。"
      );
    }


    if (allDay) {
      if (
        sameDaySchedules.length >
        0
      ) {
        return (
          "この日にはすでに対応不可時間が登録されています。先に時間帯の予定を削除してください。"
        );
      }

      return "";
    }


    const newStart =
      timeToMinutes(
        startTime
      );

    const newEnd =
      timeToMinutes(
        endTime
      );


    const overlapping =
      sameDaySchedules.some(
        (schedule) => {
          if (
            schedule.all_day
          ) {
            return true;
          }


          const existingStart =
            timeToMinutes(
              schedule.start_time
            );

          const existingEnd =
            timeToMinutes(
              schedule.end_time
            );


          return (
            newStart <
              existingEnd &&
            newEnd >
              existingStart
          );
        }
      );


    if (overlapping) {
      return (
        "すでに登録されている対応不可時間と重なっています。"
      );
    }


    return "";
  }


  async function handleRegister() {
    setError("");
    setSuccessMessage("");


    if (!coachId) {
      setError(
        "コーチIDを取得できません。もう一度ログインしてください。"
      );

      return;
    }


    if (!selectedDate) {
      setError(
        "日付を選択してください。"
      );

      return;
    }


    if (!allDay) {
      if (
        !startTime ||
        !endTime
      ) {
        setError(
          "開始時間と終了時間を入力してください。"
        );

        return;
      }


      if (
        timeToMinutes(
          startTime
        ) >=
        timeToMinutes(
          endTime
        )
      ) {
        setError(
          "終了時間は開始時間より後にしてください。"
        );

        return;
      }
    }


    const conflictMessage =
      hasScheduleConflict();


    if (conflictMessage) {
      setError(
        conflictMessage
      );

      return;
    }


    try {
      setSaving(true);


      const insertData = {
        coach_id:
          Number(
            coachId
          ),

        schedule_date:
          selectedDate,

        all_day:
          allDay,

        start_time:
          allDay
            ? null
            : startTime,

        end_time:
          allDay
            ? null
            : endTime,

        memo:
          memo.trim() ||
          null,
      };


      const {
        error: insertError,
      } = await supabase
        .from(
          "coach_schedules"
        )
        .insert(
          insertData
        );


      if (insertError) {
        throw insertError;
      }


      if (allDay) {
        setSuccessMessage(
          `${selectedDate} を終日対応不可にしました。`
        );
      } else {
        setSuccessMessage(
          `${selectedDate} ${startTime}〜${endTime} を対応不可にしました。`
        );
      }


      setSelectedDate("");
      setAllDay(false);
      setStartTime("10:00");
      setEndTime("11:00");
      setMemo("");


      await fetchSchedules();

    } catch (err) {
      console.error(
        "予定登録エラー:",
        err
      );


      setError(
        `予定の登録に失敗しました：${
          err?.message ||
          "原因不明のエラー"
        }`
      );

    } finally {
      setSaving(false);
    }
  }


  async function handleDelete(
    scheduleId
  ) {
    const confirmed =
      window.confirm(
        "この予定を削除しますか？"
      );


    if (!confirmed) {
      return;
    }


    setError("");
    setSuccessMessage("");


    const {
      error: deleteError,
    } = await supabase
      .from(
        "coach_schedules"
      )
      .delete()
      .eq(
        "id",
        scheduleId
      )
      .eq(
        "coach_id",
        Number(
          coachId
        )
      );


    if (deleteError) {
      console.error(
        "予定削除エラー:",
        deleteError
      );

      setError(
        `予定の削除に失敗しました：${deleteError.message}`
      );

      return;
    }


    setSuccessMessage(
      "予定を削除しました。"
    );


    await fetchSchedules();
  }


  const allDayDisabledDates =
    [
      ...new Set(
        schedules
          .filter(
            (schedule) =>
              schedule.all_day
          )
          .map(
            (schedule) =>
              schedule.schedule_date
          )
      ),
    ];


  if (loading) {
    return (
      <p>
        読み込み中...
      </p>
    );
  }


  return (
    <div className="coach-schedule-page">

      <header className="coach-schedule-header">

        <div>

          <span className="page-eyebrow">
            SCHEDULE
          </span>

          <h2>
            予定管理
          </h2>

          <p>
            {coachName
              ? `${coachName}さんの対応できない日時を登録します`
              : "対応できない日時を登録します"}
          </p>

        </div>

      </header>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {successMessage && (
        <div className="schedule-success-message">
          {successMessage}
        </div>
      )}


      <div className="coach-schedule-layout">

        <section className="content-card">

          <div className="section-title">

            <div>

              <h3>
                対応不可日時を追加
              </h3>

              <p>
                対応できない日と
                時間を設定してください
              </p>

            </div>

          </div>


          <CoachCalendar
            value={
              selectedDate
            }
            onChange={
              setSelectedDate
            }
            disabledDates={
              allDayDisabledDates
            }
            minDate={
              today
            }
          />


          {selectedDate && (
            <div className="selected-schedule-date">

              選択中：

              <strong>
                {selectedDate}
              </strong>

            </div>
          )}


          <label className="schedule-all-day">

            <input
              type="checkbox"
              checked={
                allDay
              }
              onChange={(event) =>
                setAllDay(
                  event.target.checked
                )
              }
            />

            <span>
              終日対応不可
            </span>

          </label>


          {!allDay && (
            <div className="schedule-time-grid">

              <div className="schedule-field">

                <label htmlFor="startTime">
                  開始時間
                </label>

                <input
                  id="startTime"
                  type="time"
                  step="1800"
                  value={
                    startTime
                  }
                  onChange={(event) =>
                    setStartTime(
                      event.target.value
                    )
                  }
                />

              </div>


              <div className="schedule-field">

                <label htmlFor="endTime">
                  終了時間
                </label>

                <input
                  id="endTime"
                  type="time"
                  step="1800"
                  value={
                    endTime
                  }
                  onChange={(event) =>
                    setEndTime(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>
          )}


          <div className="schedule-field">

            <label htmlFor="scheduleMemo">
              メモ
            </label>

            <input
              id="scheduleMemo"
              type="text"
              value={
                memo
              }
              placeholder="例：大会、私用など"
              onChange={(event) =>
                setMemo(
                  event.target.value
                )
              }
            />

          </div>


          <div className="schedule-register-action">

            <button
              type="button"
              className="primary-button"
              disabled={
                saving ||
                !selectedDate ||
                !coachId
              }
              onClick={
                handleRegister
              }
            >
              {saving
                ? "登録中..."
                : allDay
                  ? "終日対応不可にする"
                  : "対応不可時間を登録"}
            </button>

          </div>

        </section>


        <section className="content-card">

          <div className="section-title">

            <div>

              <h3>
                登録済みの予定
              </h3>

              <p>
                現在の対応不可日時です
              </p>

            </div>


            <span>
              {schedules.length}件
            </span>

          </div>


          {schedules.length ===
          0 ? (

            <div className="schedule-empty">
              対応不可日時は
              登録されていません
            </div>

          ) : (

            <div className="schedule-list">

              {schedules.map(
                (schedule) => (

                  <div
                    key={
                      schedule.id
                    }
                    className="schedule-list-item"
                  >

                    <div className="schedule-list-content">

                      <strong>
                        {
                          schedule.schedule_date
                        }
                      </strong>


                      {schedule.all_day ? (

                        <span className="schedule-all-day-badge">
                          終日
                        </span>

                      ) : (

                        <span className="schedule-time-text">
                          {formatTime(
                            schedule.start_time
                          )}
                          〜
                          {formatTime(
                            schedule.end_time
                          )}
                        </span>

                      )}


                      {schedule.memo && (
                        <p>
                          {
                            schedule.memo
                          }
                        </p>
                      )}

                    </div>


                    <button
                      type="button"
                      className="schedule-delete-button"
                      onClick={() =>
                        handleDelete(
                          schedule.id
                        )
                      }
                    >
                      削除
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </div>
  );
}


export default CoachSchedule;