import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  supabase,
} from "../supabase";

import "../styles/coaching.css";


const COACHING_TYPE_LABELS = {
  online: "オンライン",
  offline: "オフライン",
  replay: "リプレイのみ",
};


function CoachingNew() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    searchParams,
  ] =
    useSearchParams();

  const requestId =
    searchParams.get(
      "requestId"
    );


  const coachName =
    localStorage.getItem(
      "coachName"
    ) || "コーチ";

  const coachIdValue =
    localStorage.getItem(
      "coachId"
    );

  const coachId =
    coachIdValue
      ? Number(coachIdValue)
      : null;


  const [
    student,
    setStudent,
  ] = useState(null);

  const [
    coachingRequest,
    setCoachingRequest,
  ] = useState(null);


  const [
    date,
    setDate,
  ] = useState(
    new Date()
      .toISOString()
      .slice(
        0,
        10
      )
  );

  const [
    mr,
    setMr,
  ] = useState("");

  const [
    matchContent,
    setMatchContent,
  ] = useState("");

  const [
    goodPoints,
    setGoodPoints,
  ] = useState("");

  const [
    improvementPoints,
    setImprovementPoints,
  ] = useState("");


  /* =========================
     Coach Task
  ========================= */

  const [
    nextTask,
    setNextTask,
  ] = useState("");

  const [
    taskDescription,
    setTaskDescription,
  ] = useState("");

  const [
    taskTargetCount,
    setTaskTargetCount,
  ] = useState("");

  const [
    taskDueDate,
    setTaskDueDate,
  ] = useState("");


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
    errorMessage,
    setErrorMessage,
  ] = useState("");


  useEffect(() => {
    fetchData();
  }, [
    id,
    requestId,
  ]);


  /* =========================
     Fetch
  ========================= */

  async function fetchData() {
    setLoading(true);
    setErrorMessage("");

    const studentId =
      Number(id);


    if (
      Number.isNaN(
        studentId
      )
    ) {
      setErrorMessage(
        "生徒IDが正しくありません。"
      );

      setLoading(false);

      return;
    }


    const {
      data: studentData,
      error: studentError,
    } =
      await supabase
        .from("students")
        .select("*")
        .eq(
          "id",
          studentId
        )
        .maybeSingle();


    if (studentError) {
      console.error(
        "生徒取得エラー:",
        studentError
      );

      setErrorMessage(
        studentError.message
      );

      setLoading(false);

      return;
    }


    if (!studentData) {
      setErrorMessage(
        "生徒が見つかりません。"
      );

      setLoading(false);

      return;
    }


    setStudent(
      studentData
    );


    if (
      studentData.mr !==
        null &&
      studentData.mr !==
        undefined
    ) {
      setMr(
        String(
          studentData.mr
        )
      );
    }


    if (requestId) {
      const {
        data: requestData,
        error: requestError,
      } =
        await supabase
          .from(
            "coaching_requests"
          )
          .select("*")
          .eq(
            "id",
            Number(
              requestId
            )
          )
          .maybeSingle();


      if (requestError) {
        console.error(
          "申込情報取得エラー:",
          requestError
        );

        setErrorMessage(
          requestError.message
        );

        setLoading(false);

        return;
      }


      setCoachingRequest(
        requestData
      );


      const {
        data: existingRecord,
        error: existingError,
      } =
        await supabase
          .from(
            "coaching_records"
          )
          .select("id")
          .eq(
            "request_id",
            Number(
              requestId
            )
          )
          .maybeSingle();


      if (existingError) {
        console.error(
          "既存記録確認エラー:",
          existingError
        );
      }


      if (existingRecord) {
        setErrorMessage(
          "この申し込みはすでにコーチング結果が登録されています。"
        );
      }
    }


    setLoading(false);
  }


  /* =========================
     Submit
  ========================= */

  async function handleSubmit(
    event
  ) {
    event.preventDefault();


    if (!student) {
      return;
    }


    if (!date) {
      setErrorMessage(
        "実施日を入力してください。"
      );

      return;
    }


    if (!matchContent.trim()) {
      setErrorMessage(
        "今回やったことを入力してください。"
      );

      return;
    }


    if (!goodPoints.trim()) {
      setErrorMessage(
        "良かったところを入力してください。"
      );

      return;
    }


    if (
      !improvementPoints.trim()
    ) {
      setErrorMessage(
        "改善するところを入力してください。"
      );

      return;
    }


    if (!nextTask.trim()) {
      setErrorMessage(
        "次回までの課題を入力してください。"
      );

      return;
    }


    /* =========================
       MR Validation
    ========================= */

    let mrValue = null;


    if (
      mr.trim() !== ""
    ) {
      mrValue =
        Number(mr);


      if (
        Number.isNaN(
          mrValue
        ) ||
        mrValue < 0
      ) {
        setErrorMessage(
          "MRは0以上の数字で入力してください。"
        );

        return;
      }
    }


    /* =========================
       Target Count Validation
    ========================= */

    let targetCountValue =
      null;


    if (
      taskTargetCount.trim() !==
      ""
    ) {
      targetCountValue =
        Number(
          taskTargetCount
        );


      if (
        Number.isNaN(
          targetCountValue
        ) ||
        targetCountValue <= 0
      ) {
        setErrorMessage(
          "目標回数は1以上の数字で入力してください。"
        );

        return;
      }
    }


    try {
      setSaving(true);
      setErrorMessage("");


      const studentId =
        Number(id);


      /* =========================
         Coaching Record
      ========================= */

      const {
        error: insertError,
      } =
        await supabase
          .from(
            "coaching_records"
          )
          .insert({
            student_id:
              studentId,

            coach:
              coachName,

            date,

            mr:
              mrValue,

            match_content:
              matchContent.trim(),

            good_points:
              goodPoints.trim(),

            improvement_points:
              improvementPoints.trim(),

            next_task:
              nextTask.trim(),

            memo:
              memo.trim() ||
              null,

            request_id:
              requestId
                ? Number(
                    requestId
                  )
                : null,
          });


      if (insertError) {
        throw insertError;
      }


      /* =========================
         Coach Task
      ========================= */

      const {
        error: taskInsertError,
      } =
        await supabase
          .from(
            "student_tasks"
          )
          .insert({
            student_id:
              studentId,

            task_type:
              "coach",

            title:
              nextTask.trim(),

            description:
              taskDescription.trim() ||
              null,

            target_count:
              targetCountValue,

            current_count:
              0,

            due_date:
              taskDueDate ||
              null,

            status:
              "active",

            coach_id:
              coachId,
          });


      if (taskInsertError) {
        throw taskInsertError;
      }


      /* =========================
         Update Student MR
      ========================= */

      if (
        mrValue !== null
      ) {
        const {
          error: studentUpdateError,
        } =
          await supabase
            .from("students")
            .update({
              mr:
                mrValue,
            })
            .eq(
              "id",
              studentId
            );


        if (
          studentUpdateError
        ) {
          throw studentUpdateError;
        }
      }


      /* =========================
         Complete Request
      ========================= */

      if (requestId) {
        const {
          error: requestUpdateError,
        } =
          await supabase
            .from(
              "coaching_requests"
            )
            .update({
              status:
                "completed",

              updated_at:
                new Date()
                  .toISOString(),
            })
            .eq(
              "id",
              Number(
                requestId
              )
            )
            .eq(
              "status",
              "accepted"
            );


        if (
          requestUpdateError
        ) {
          throw requestUpdateError;
        }
      }


      alert(
        "コーチング結果と課題を保存しました。"
      );


      navigate(
        "/coach"
      );

    } catch (error) {
      console.error(
        "コーチング結果保存エラー:",
        error
      );

      setErrorMessage(
        `保存に失敗しました：${error.message}`
      );

    } finally {
      setSaving(false);
    }
  }


  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <p>
        読み込み中...
      </p>
    );
  }


  /* =========================
     Student Not Found
  ========================= */

  if (!student) {
    return (
      <div>

        <h2>
          コーチング結果入力
        </h2>


        <p className="error-message">
          {errorMessage ||
            "生徒が見つかりません。"}
        </p>

      </div>
    );
  }


  /* =========================
     Render
  ========================= */

  return (
    <div>

      {/* =====================
          Header
      ===================== */}

      <header>

        <div>

          <h2>
            コーチング結果入力
          </h2>


          <p>
            {student.name}
            さんのコーチング結果を
            記録します
          </p>

        </div>

      </header>


      {errorMessage && (

        <p className="error-message">
          {errorMessage}
        </p>

      )}


      {/* =====================
          Student
      ===================== */}

      <section className="content-card">

        <div className="section-title">

          <h3>
            生徒情報
          </h3>

        </div>


        <div className="student-detail-grid">

          <div>

            <span className="detail-label">
              プレイヤー名
            </span>

            <strong>
              {student.name}
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
              現在のランク
            </span>

            <strong>
              {student.rank ||
                "-"}
            </strong>

          </div>


          <div>

            <span className="detail-label">
              現在のMR
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
              {coachName}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================
          Request
      ===================== */}

      {coachingRequest && (

        <section className="content-card">

          <div className="section-title">

            <h3>
              今回の申し込み
            </h3>

          </div>


          <div className="student-detail-grid">

            <div>

              <span className="detail-label">
                コーチング種別
              </span>

              <strong>
                {
                  COACHING_TYPE_LABELS[
                    coachingRequest
                      .coaching_type
                  ] ||
                  coachingRequest
                    .coaching_type
                }
              </strong>

            </div>


            <div>

              <span className="detail-label">
                希望日
              </span>

              <strong>
                {coachingRequest
                  .preferred_date ||
                  "-"}
              </strong>

            </div>


            <div>

              <span className="detail-label">
                希望時間
              </span>

              <strong>
                {coachingRequest
                  .preferred_time
                  ? coachingRequest
                      .preferred_time
                      .slice(
                        0,
                        5
                      )
                  : "-"}
              </strong>

            </div>


            <div>

              <span className="detail-label">
                リプレイID
              </span>

              <strong>
                {coachingRequest
                  .replay_id ||
                  "-"}
              </strong>

            </div>

          </div>


          <div
            style={{
              marginTop:
                "22px",
            }}
          >

            <span className="detail-label">
              相談内容
            </span>


            <p
              style={{
                whiteSpace:
                  "pre-wrap",
              }}
            >
              {coachingRequest
                .request}
            </p>

          </div>

        </section>

      )}


      {/* =====================
          Result Form
      ===================== */}

      <section className="content-card">

        <div className="section-title">

          <div>

            <h3>
              コーチング結果
            </h3>


            <p>
              今回の内容と
              次回までの課題を
              記録します
            </p>

          </div>

        </div>


        <form
          className="student-form"
          onSubmit={
            handleSubmit
          }
        >

          {/* =====================
              Date
          ===================== */}

          <div className="form-group">

            <label htmlFor="date">
              実施日
            </label>


            <input
              id="date"
              type="date"
              value={date}
              onChange={(
                event
              ) =>
                setDate(
                  event.target
                    .value
                )
              }
              required
            />

          </div>


          {/* =====================
              MR
          ===================== */}

          <div className="form-group">

            <label htmlFor="mr">
              コーチング実施時のMR
            </label>


            <input
              id="mr"
              type="number"
              min="0"
              value={mr}
              onChange={(
                event
              ) =>
                setMr(
                  event.target
                    .value
                )
              }
              placeholder="例：1520"
            />


            <small
              style={{
                color:
                  "#71717a",
              }}
            >
              保存すると、
              このMRが成長グラフに
              記録されます
            </small>

          </div>


          {/* =====================
              Match Content
          ===================== */}

          <div className="form-group">

            <label htmlFor="matchContent">
              今回やったこと
            </label>


            <textarea
              id="matchContent"
              rows="4"
              value={
                matchContent
              }
              onChange={(
                event
              ) =>
                setMatchContent(
                  event.target
                    .value
                )
              }
              placeholder="例：ランクマのリプレイを確認し、対空と画面端の守りを練習"
            />

          </div>


          {/* =====================
              Good Points
          ===================== */}

          <div className="form-group">

            <label htmlFor="goodPoints">
              良かったところ
            </label>


            <textarea
              id="goodPoints"
              rows="4"
              value={
                goodPoints
              }
              onChange={(
                event
              ) =>
                setGoodPoints(
                  event.target
                    .value
                )
              }
              placeholder="今回できていたことを入力"
            />

          </div>


          {/* =====================
              Improvement
          ===================== */}

          <div className="form-group">

            <label htmlFor="improvementPoints">
              改善するところ
            </label>


            <textarea
              id="improvementPoints"
              rows="4"
              value={
                improvementPoints
              }
              onChange={(
                event
              ) =>
                setImprovementPoints(
                  event.target
                    .value
                )
              }
              placeholder="次に改善したいポイントを入力"
            />

          </div>


          {/* =====================
              Coach Task
          ===================== */}

          <div
            style={{
              marginTop:
                "10px",

              padding:
                "22px",

              border:
                "1px solid #bbf7d0",

              borderRadius:
                "12px",

              background:
                "#f0fdf4",
            }}
          >

            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >

              <h3
                style={{
                  margin:
                    "0 0 6px",

                  color:
                    "#166534",

                  fontSize:
                    "17px",
                }}
              >
                コーチからの課題
              </h3>


              <p
                style={{
                  margin:
                    "0",

                  color:
                    "#64748b",

                  fontSize:
                    "13px",
                }}
              >
                生徒がこの課題を達成すると
                50pt獲得します
              </p>

            </div>


            <div className="form-group">

              <label htmlFor="nextTask">
                課題
              </label>


              <input
                id="nextTask"
                type="text"
                value={
                  nextTask
                }
                onChange={(
                  event
                ) =>
                  setNextTask(
                    event.target
                      .value
                  )
                }
                placeholder="例：対空を安定させる"
                maxLength="100"
                required
              />

            </div>


            <div
              className="form-group"
              style={{
                marginTop:
                  "18px",
              }}
            >

              <label htmlFor="taskDescription">
                課題の説明
              </label>


              <textarea
                id="taskDescription"
                rows="3"
                value={
                  taskDescription
                }
                onChange={(
                  event
                ) =>
                  setTaskDescription(
                    event.target
                      .value
                  )
                }
                placeholder="例：ランクマッチで対空を意識してプレイする"
              />

            </div>


            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",

                gap:
                  "16px",

                marginTop:
                  "18px",
              }}
            >

              <div className="form-group">

                <label htmlFor="taskTargetCount">
                  目標回数
                </label>


                <input
                  id="taskTargetCount"
                  type="number"
                  min="1"
                  value={
                    taskTargetCount
                  }
                  onChange={(
                    event
                  ) =>
                    setTaskTargetCount(
                      event.target
                        .value
                    )
                  }
                  placeholder="例：10"
                />


                <small
                  style={{
                    color:
                      "#64748b",
                  }}
                >
                  回数で管理しない場合は
                  空欄でOKです
                </small>

              </div>


              <div className="form-group">

                <label htmlFor="taskDueDate">
                  期限
                </label>


                <input
                  id="taskDueDate"
                  type="date"
                  value={
                    taskDueDate
                  }
                  onChange={(
                    event
                  ) =>
                    setTaskDueDate(
                      event.target
                        .value
                    )
                  }
                />


                <small
                  style={{
                    color:
                      "#64748b",
                  }}
                >
                  期限を設定しない場合は
                  空欄でOKです
                </small>

              </div>

            </div>


            <div
              style={{
                marginTop:
                  "18px",

                padding:
                  "12px 14px",

                borderRadius:
                  "8px",

                background:
                  "#dcfce7",

                color:
                  "#166534",

                fontSize:
                  "13px",

                fontWeight:
                  "700",
              }}
            >
              🎁 課題達成で +50pt
            </div>

          </div>


          {/* =====================
              Memo
          ===================== */}

          <div className="form-group">

            <label htmlFor="memo">
              コーチ用メモ
            </label>


            <textarea
              id="memo"
              rows="4"
              value={memo}
              onChange={(
                event
              ) =>
                setMemo(
                  event.target
                    .value
                )
              }
              placeholder="生徒には表示しない内部メモ"
            />

          </div>


          {/* =====================
              Actions
          ===================== */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate(
                  "/coach"
                )
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
                : "結果を保存"}
            </button>

          </div>

        </form>

      </section>

    </div>
  );
}


export default CoachingNew;