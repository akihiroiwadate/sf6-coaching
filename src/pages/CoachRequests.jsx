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
    new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(date);
}


function formatCreatedAt(value) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
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

  if (
    !item.preferred_time
  ) {
    return date;
  }

  const time =
    item.preferred_time.slice(
      0,
      5
    );

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
        error,
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


      if (error) {
        throw error;
      }


      setRequests(
        data || []
      );

    } catch (error) {
      console.error(
        "申し込み取得エラー:",
        error
      );

      setError(
        error.message ||
        "申し込みの取得に失敗しました。"
      );

    } finally {
      setLoading(false);
    }
  }


  async function handleAccept(
    requestId
  ) {
    if (!coachId) {
      setError(
        "ログイン中のコーチ情報が取得できません。"
      );

      return;
    }


    const confirmed =
      window.confirm(
        "この申し込みを受諾しますか？"
      );


    if (!confirmed) {
      return;
    }


    try {
      setAcceptingId(
        requestId
      );

      setError("");
      setMessage("");


      const now =
        new Date().toISOString();


      const {
        data,
        error,
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


      if (error) {
        throw error;
      }


      if (
        !data ||
        data.length === 0
      ) {
        setError(
          "この申し込みは、すでに他のコーチが受諾しています。"
        );

        await loadRequests();

        return;
      }


      setMessage(
        "申し込みを受諾しました。"
      );


      await loadRequests();

    } catch (error) {
      console.error(
        "受諾エラー:",
        error
      );

      setError(
        error.message ||
        "申し込みの受諾に失敗しました。"
      );

    } finally {
      setAcceptingId(
        null
      );
    }
  }


  return (
    <div className="coach-requests-page">

      <header>

        <div>

          <h2>
            コーチング申し込み
          </h2>

          <p>
            内容を確認して、
            対応できる申し込みを
            受諾してください
          </p>

        </div>


        <div className="coach-request-count">
          {requests.length}件
        </div>

      </header>


      <section className="content-card coach-request-summary">

        <div>

          <span className="coach-request-summary-label">
            ログイン中のコーチ
          </span>

          <strong>
            {coachName ||
              "コーチ"}
          </strong>

        </div>


        <div>

          <span className="coach-request-summary-label">
            新しい申し込み
          </span>

          <strong>
            {requests.length}件
          </strong>

        </div>

      </section>


      {message && (
        <p className="success-message">
          {message}
        </p>
      )}


      {error && (
        <p className="error-message">
          {error}
        </p>
      )}


      {loading ? (

        <section className="content-card">

          <p>
            申し込みを
            読み込んでいます...
          </p>

        </section>

      ) : requests.length === 0 ? (

        <section className="content-card coach-request-empty">

          <h3>
            新しい申し込みはありません
          </h3>

          <p>
            新しいコーチング申し込みが届くと
            ここに表示されます。
          </p>

        </section>

      ) : (

        <div className="coach-request-list">

          {requests.map(
            (item) => (
              <article
                key={item.id}
                className="coach-request-card"
              >

                <div className="coach-request-card-header">

                  <div className="coach-request-student">

                    <div className="coach-request-avatar">
                      {getStudentName(
                        item
                      )
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>


                    <div>

                      <div className="coach-request-name-row">

                        <h3>
                          {getStudentName(
                            item
                          )}
                        </h3>

                        <span className="coach-request-status">
                          新規
                        </span>

                      </div>


                      <p className="coach-request-created-at">
                        申込：
                        {formatCreatedAt(
                          item.created_at
                        )}
                      </p>

                    </div>

                  </div>


                  <span className="coach-request-type">
                    {
                      COACHING_TYPE_LABELS[
                        item.coaching_type
                      ] ||
                      item.coaching_type
                    }
                  </span>

                </div>


                <div className="coach-request-info-grid">

                  <div className="coach-request-info">

                    <span className="coach-request-info-label">
                      希望日時
                    </span>

                    <strong>
                      {getPreferredDateTime(
                        item
                      )}
                    </strong>

                  </div>


                  <div className="coach-request-info">

                    <span className="coach-request-info-label">
                      コーチング方法
                    </span>

                    <strong>
                      {
                        COACHING_TYPE_LABELS[
                          item.coaching_type
                        ] ||
                        item.coaching_type
                      }
                    </strong>

                  </div>


                  {item.replay_id && (

                    <div className="coach-request-info">

                      <span className="coach-request-info-label">
                        リプレイID
                      </span>

                      <strong>
                        {item.replay_id}
                      </strong>

                    </div>

                  )}

                </div>


                <div className="coach-request-consultation">

                  <span className="coach-request-info-label">
                    相談内容
                  </span>

                  <p>
                    {item.request}
                  </p>

                </div>


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
                    onClick={() =>
                      handleAccept(
                        item.id
                      )
                    }
                    disabled={
                      acceptingId ===
                      item.id
                    }
                  >

                    {acceptingId ===
                    item.id
                      ? "受諾中..."
                      : "この申し込みを受諾する"}

                  </button>

                </div>

              </article>
            )
          )}

        </div>

      )}

    </div>
  );
}


export default CoachRequests;