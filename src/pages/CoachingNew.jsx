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

  const [
    nextTask,
    setNextTask,
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


    try {
      setSaving(true);
      setErrorMessage("");


      /*
       * コーチング記録を保存
       */
      const {
        error: insertError,
      } =
        await supabase
          .from(
            "coaching_records"
          )
          .insert({
            student_id:
              Number(id),

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


      /*
       * 現在MRを生徒情報にも反映
       */
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
              Number(id)
            );


        if (
          studentUpdateError
        ) {
          throw studentUpdateError;
        }
      }


      /*
       * コーチからの課題も
       * 最新の次回課題に更新
       */
      const {
        error: taskUpdateError,
      } =
        await supabase
          .from("students")
          .update({
            task:
              nextTask.trim(),
          })
          .eq(
            "id",
            Number(id)
          );


      if (
        taskUpdateError
      ) {
        throw taskUpdateError;
      }


      /*
       * 申込経由なら
       * completed に変更
       */
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
        "コーチング結果を保存しました。"
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


  if (loading) {
    return (
      <p>
        読み込み中...
      </p>
    );
  }


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


  return (
    <div>

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


          <div className="form-group">

            <label htmlFor="nextTask">
              次回までの課題
            </label>

            <textarea
              id="nextTask"
              rows="4"
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
              placeholder="例：ランクマ10試合で対空を意識する"
            />

          </div>


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