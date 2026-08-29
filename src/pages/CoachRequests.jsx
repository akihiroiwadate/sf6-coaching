import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  supabase,
} from "../supabase";

import "../styles/coach.css";


const COACHING_TYPE_LABELS = {
  online: "オンライン",
  offline: "オフライン",
  replay: "リプレイのみ",
};


function formatDate(value) {
  if (!value) {
    return "未指定";
  }

  const date =
    new Date(
      `${value}T00:00:00`
    );

  return date.toLocaleDateString(
    "ja-JP",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}


function formatCreatedAt(value) {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  return date.toLocaleString(
    "ja-JP",
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


function getStudentName(item) {
  return (
    item.students?.name ||
    `生徒ID：${item.student_id}`
  );
}


function getPreferredDateTime(item) {
  const date =
    formatDate(
      item.preferred_date
    );

  const time =
    item.preferred_time
      ? item.preferred_time.slice(
          0,
          5
        )
      : "";

  if (!time) {
    return date;
  }

  return `${date} ${time}`;
}


function CoachRequests() {
  const [
    requests,
    setRequests,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    acceptingId,
    setAcceptingId,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");


  const coachId =
    localStorage.getItem(
      "coachId"
    );

  const coachName =
    localStorage.getItem(
      "coachName"
    );


  useEffect(() => {
    loadRequests();
  }, []);


  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const {
        data,
        error: fetchError,
      } =
        await supabase
          .from(
            "coaching_requests"
          )
          .select(`
            id,
            student_id,
            coaching_type,
            preferred_date,
            preferred_time,
            request,
            replay_id,
            replay_image_path,
            status,
            created_at,
            students (
              id,
              name
            )
          `)
          .eq(
            "status",
            "pending"
          )
          .order(
            "created_at",
            {
              ascending: true,
            }
          );

      if (fetchError) {
        throw fetchError;
      }

      setRequests(
        data || []
      );

    } catch (err) {
      console.error(
        "申し込み取得エラー:",
        err
      );

      setError(
        `申し込み情報の取得に失敗しました。${
          err?.message
            ? ` ${err.message}`
            : ""
        }`
      );

    } finally {
      setLoading(false);
    }
  }


  async function handleAccept(
    requestId
  ) {
    setMessage("");
    setError("");

    if (!coachId) {
      setError(
        "ログイン中のコーチIDを取得できません。ログアウトして、もう一度コーチでログインしてください。"
      );

      return;
    }

    const confirmed =
      window.confirm(
        "このコーチング申し込みを受諾しますか？"
      );

    if (!confirmed) {
      return;
    }

    try {
      setAcceptingId(
        requestId
      );

      const now =
        new Date()
          .toISOString();

      const {
        data,
        error: updateError,
      } =
        await supabase
          .from(
            "coaching_requests"
          )
          .update({
            status:
              "accepted",

            coach_id:
              Number(
                coachId
              ),

            accepted_at:
              now,

            updated_at:
              now,
          })
          .eq(
            "id",
            requestId
          )
          .eq(
            "status",
            "pending"
          )
          .select();

      if (updateError) {
        throw updateError;
      }

      if (
        !data ||
        data.length === 0
      ) {
        setError(
          "この申し込みは、すでに別のコーチが受諾した可能性があります。"
        );

        await loadRequests();

        return;
      }

      setMessage(
        "申し込みを受諾しました。担当コーチングに移動しました。"
      );

      await loadRequests();

    } catch (err) {
      console.error(
        "受諾エラー:",
        err
      );

      setError(
        `受諾に失敗しました。${
          err?.message
            ? ` ${err.message}`
            : ""
        }`
      );

    } finally {
      setAcceptingId(
        null
      );
    }
  }


  if (loading) {
    return (
      <div className="coach-requests-page">

        <header>
          <div>
            <h2>
              新しい申し込み
            </h2>

            <p>
              コーチング申し込みを
              読み込んでいます
            </p>
          </div>
        </header>

        <section className="content-card">
          <p>
            読み込み中...
          </p>
        </section>

      </div>
    );
  }


  return (
    <div className="coach-requests-page">

      {/* =========================
          Header
      ========================= */}

      <header>

        <div>
          <h2>
            新しい申し込み
          </h2>

          <p>
            まだ担当コーチが
            決まっていない申し込みです
          </p>
        </div>

      </header>


      {/* =========================
          Coach Info
      ========================= */}

      <section className="content-card">

        <div className="coach-request-summary">

          <div>
            <span className="detail-label">
              ログイン中のコーチ
            </span>

            <strong>
              {coachName ||
                "コーチ"}
            </strong>
          </div>


          <div>
            <span className="detail-label">
              新しい申し込み
            </span>

            <strong>
              {requests.length}
              件
            </strong>
          </div>

        </div>

      </section>


      {/* =========================
          Messages
      ========================= */}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {!coachId && (
        <div className="error-message">
          現在のログイン情報に
          coachId がありません。
          ログアウトして、
          もう一度コーチで
          ログインしてください。
        </div>
      )}


      {/* =========================
          Requests
      ========================= */}

      <section className="content-card">

        <div className="section-title">

          <div>
            <h3>
              コーチング申し込み
            </h3>

            <p>
              内容を確認して、
              対応できる申し込みを
              受諾してください
            </p>
          </div>

          <span>
            {requests.length}
            件
          </span>

        </div>


        {requests.length ===
        0 ? (

          <div className="coach-request-empty">

            <strong>
              新しい申し込みはありません
            </strong>

            <p>
              新しい申し込みが入ると
              ここに表示されます
            </p>

          </div>

        ) : (

          <div className="coaching-history">

            {requests.map(
              (item) => {

                const studentName =
                  getStudentName(
                    item
                  );

                return (
                  <article
                    key={
                      item.id
                    }
                    className="coaching-record"
                  >

                    {/* =====================
                        Card Header
                    ===================== */}

                    <div className="coaching-record-header">

                      <div>

                        <strong>
                          {studentName}
                        </strong>


                        <span className="coach-request-status">
                          新規
                        </span>


                        <span className="coach-request-type">
                          {
                            COACHING_TYPE_LABELS[
                              item.coaching_type
                            ] ||
                            item.coaching_type
                          }
                        </span>

                      </div>


                      <span>
                        申込：
                        {
                          formatCreatedAt(
                            item.created_at
                          )
                        }
                      </span>

                    </div>


                    {/* =====================
                        Main Info
                    ===================== */}

                    <div className="coaching-record-content">

                      <div>
                        <h4>
                          希望日時
                        </h4>

                        <p>
                          {
                            getPreferredDateTime(
                              item
                            )
                          }
                        </p>
                      </div>


                      <div>
                        <h4>
                          コーチング方法
                        </h4>

                        <p>
                          {
                            COACHING_TYPE_LABELS[
                              item.coaching_type
                            ] ||
                            item.coaching_type
                          }
                        </p>
                      </div>


                      {item.replay_id && (
                        <div>
                          <h4>
                            リプレイID
                          </h4>

                          <p>
                            {
                              item.replay_id
                            }
                          </p>
                        </div>
                      )}


                      <div className="coach-request-content">

                        <h4>
                          相談内容
                        </h4>

                        <p>
                          {
                            item.request
                          }
                        </p>

                      </div>

                    </div>


                    {/* =====================
                        Actions
                    ===================== */}

                    <div className="coach-request-actions">

                      <Link
                        to={`/students/${item.student_id}`}
                        className="cancel-button"
                      >
                        生徒情報を見る
                      </Link>


                      <button
                        type="button"
                        className="primary-button"
                        disabled={
                          acceptingId ===
                            item.id ||
                          !coachId
                        }
                        onClick={() =>
                          handleAccept(
                            item.id
                          )
                        }
                      >

                        {acceptingId ===
                        item.id
                          ? "受諾中..."
                          : "この申し込みを受諾する"}

                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

    </div>
  );
}


export default CoachRequests;