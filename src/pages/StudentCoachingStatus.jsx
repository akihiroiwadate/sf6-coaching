import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  supabase,
} from "../lib/supabase";

import "../styles/student/student-coaching-status.css";


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

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(date);
}


function formatDateTime(value) {
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


function getPreferredDateTime(item) {
  const date =
    formatDate(
      item.preferred_date
    );

  if (!item.preferred_time) {
    return date;
  }

  const time =
    item.preferred_time.slice(
      0,
      5
    );

  return `${date} ${time}`;
}


function getStatusInfo(item) {
  if (
    item.status === "pending"
  ) {
    return {
      label: "申込中",
      className:
        "student-coaching-status-pending",
    };
  }


  if (
    item.status === "accepted"
  ) {
    return {
      label: "受諾済み",
      className:
        "student-coaching-status-accepted",
    };
  }


  if (
    item.status === "completed"
  ) {
    return {
      label: "完了",
      className:
        "student-coaching-status-completed",
    };
  }


  if (
    item.status === "cancelled" &&
    item.cancelled_by === "coach"
  ) {
    return {
      label: "コーチから拒否",
      className:
        "student-coaching-status-rejected",
    };
  }


  if (
    item.status === "cancelled" &&
    item.cancelled_by === "student"
  ) {
    return {
      label: "キャンセル済み",
      className:
        "student-coaching-status-cancelled",
    };
  }


  if (
    item.status === "cancelled"
  ) {
    return {
      label: "キャンセル",
      className:
        "student-coaching-status-cancelled",
    };
  }


  return {
    label: item.status,
    className:
      "student-coaching-status-default",
  };
}


function StudentCoachingStatus() {
  const [
    requests,
    setRequests,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    cancellingId,
    setCancellingId,
  ] = useState(null);


  const [
    error,
    setError,
  ] = useState("");


  const [
    message,
    setMessage,
  ] = useState("");


  const studentId =
    localStorage.getItem(
      "studentId"
    );


  useEffect(() => {
    loadRequests();
  }, []);


  async function loadRequests() {
    if (!studentId) {
      setError(
        "ログイン中の生徒情報が取得できません。"
      );

      setLoading(false);

      return;
    }


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
            status,
            coach_id,
            rejection_reason,
            cancelled_by,
            created_at,
            updated_at,
            coaches (
              id,
              name,
              avatar_path
            )
          `)
          .eq(
            "student_id",
            Number(
              studentId
            )
          )
          .order(
            "created_at",
            {
              ascending: false,
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
        "申込状況取得エラー:",
        error
      );


      setError(
        error.message ||
          "コーチング申込状況の取得に失敗しました。"
      );

    } finally {
      setLoading(false);
    }
  }


  async function handleCancel(
    item
  ) {
    if (
      item.status !== "pending"
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        "このコーチング申し込みをキャンセルしますか？"
      );


    if (!confirmed) {
      return;
    }


    try {
      setCancellingId(
        item.id
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
              "cancelled",

            cancelled_by:
              "student",

            rejection_reason:
              null,

            updated_at:
              now,
          })
          .eq(
            "id",
            item.id
          )
          .eq(
            "student_id",
            Number(
              studentId
            )
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
          "この申し込みはすでに処理されています。"
        );

        await loadRequests();

        return;
      }


      setMessage(
        "コーチング申し込みをキャンセルしました。"
      );


      await loadRequests();

    } catch (error) {
      console.error(
        "申込キャンセルエラー:",
        error
      );


      setError(
        error.message ||
          "申し込みのキャンセルに失敗しました。"
      );

    } finally {
      setCancellingId(
        null
      );
    }
  }


  const activeRequests =
    requests.filter(
      (item) =>
        item.status ===
          "pending" ||
        item.status ===
          "accepted"
    );


  const historyRequests =
    requests.filter(
      (item) =>
        item.status ===
          "completed" ||
        item.status ===
          "cancelled"
    );


  return (
    <div className="student-coaching-status-page">

      <header className="student-coaching-status-header">

        <div>

          <h2>
            コーチング申込状況
          </h2>


          <p>
            申し込みの受諾状況や
            過去の申し込みを確認できます
          </p>

        </div>


        <Link
          to="/student/coaching/apply"
          className="primary-button"
        >
          新しく申し込む
        </Link>

      </header>


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
            申込状況を読み込んでいます...
          </p>

        </section>

      ) : (

        <>

          {/* =========================
              現在の申し込み
          ========================= */}

          <section className="student-coaching-status-section">

            <div className="student-coaching-status-section-title">

              <div>

                <h3>
                  現在の申し込み
                </h3>


                <p>
                  申込中・受諾済みの
                  コーチングです
                </p>

              </div>


              <span className="student-coaching-status-count">
                {activeRequests.length}
                件
              </span>

            </div>


            {activeRequests.length ===
            0 ? (

              <div className="content-card student-coaching-status-empty">

                <h4>
                  現在の申し込みはありません
                </h4>


                <p>
                  コーチングを受けたい場合は
                  新しく申し込んでください
                </p>


                <Link
                  to="/student/coaching/apply"
                  className="primary-button"
                >
                  コーチングを申し込む
                </Link>

              </div>

            ) : (

              <div className="student-coaching-status-list">

                {activeRequests.map(
                  (item) => {

                    const status =
                      getStatusInfo(
                        item
                      );


                    return (
                      <article
                        key={
                          item.id
                        }
                        className="content-card student-coaching-status-card"
                      >

                        <div className="student-coaching-status-card-header">

                          <div>

                            <span className="student-coaching-status-type">

                              {
                                COACHING_TYPE_LABELS[
                                  item.coaching_type
                                ] ||
                                item.coaching_type
                              }

                            </span>


                            <h3>
                              {getPreferredDateTime(
                                item
                              )}
                            </h3>

                          </div>


                          <span
                            className={`student-coaching-status-badge ${status.className}`}
                          >
                            {
                              status.label
                            }
                          </span>

                        </div>


                        <div className="student-coaching-status-info-grid">

                          <div>

                            <span className="student-coaching-status-label">
                              申込日時
                            </span>


                            <strong>
                              {formatDateTime(
                                item.created_at
                              )}
                            </strong>

                          </div>


                          <div>

                            <span className="student-coaching-status-label">
                              担当コーチ
                            </span>


                            <strong>
                              {
                                item.coaches
                                  ?.name ||
                                (
                                  item.status ===
                                  "pending"
                                    ? "未決定"
                                    : "-"
                                )
                              }
                            </strong>

                          </div>


                          {item.replay_id && (

                            <div>

                              <span className="student-coaching-status-label">
                                リプレイID
                              </span>


                              <strong>
                                {
                                  item.replay_id
                                }
                              </strong>

                            </div>

                          )}

                        </div>


                        <div className="student-coaching-status-request">

                          <span className="student-coaching-status-label">
                            相談内容
                          </span>


                          <p>
                            {
                              item.request ||
                              "-"
                            }
                          </p>

                        </div>


                        {item.status ===
                          "pending" && (

                          <div className="student-coaching-status-actions">

                            <button
                              type="button"
                              className="student-coaching-cancel-button"
                              onClick={() =>
                                handleCancel(
                                  item
                                )
                              }
                              disabled={
                                cancellingId ===
                                item.id
                              }
                            >

                              {cancellingId ===
                              item.id
                                ? "キャンセル中..."
                                : "申込をキャンセル"}

                            </button>

                          </div>

                        )}

                      </article>
                    );
                  }
                )}

              </div>

            )}

          </section>


          {/* =========================
              過去の申し込み
          ========================= */}

          <section className="student-coaching-status-section">

            <div className="student-coaching-status-section-title">

              <div>

                <h3>
                  過去の申し込み
                </h3>


                <p>
                  完了・キャンセル・
                  拒否された申し込みです
                </p>

              </div>


              <span className="student-coaching-status-count">
                {historyRequests.length}
                件
              </span>

            </div>


            {historyRequests.length ===
            0 ? (

              <div className="content-card student-coaching-status-empty">

                <p>
                  過去の申し込みは
                  まだありません
                </p>

              </div>

            ) : (

              <div className="student-coaching-status-list">

                {historyRequests.map(
                  (item) => {

                    const status =
                      getStatusInfo(
                        item
                      );


                    return (
                      <article
                        key={
                          item.id
                        }
                        className="content-card student-coaching-status-card student-coaching-status-card-history"
                      >

                        <div className="student-coaching-status-card-header">

                          <div>

                            <span className="student-coaching-status-type">

                              {
                                COACHING_TYPE_LABELS[
                                  item.coaching_type
                                ] ||
                                item.coaching_type
                              }

                            </span>


                            <h3>
                              {getPreferredDateTime(
                                item
                              )}
                            </h3>

                          </div>


                          <span
                            className={`student-coaching-status-badge ${status.className}`}
                          >
                            {
                              status.label
                            }
                          </span>

                        </div>


                        <div className="student-coaching-status-info-grid">

                          <div>

                            <span className="student-coaching-status-label">
                              申込日時
                            </span>


                            <strong>
                              {formatDateTime(
                                item.created_at
                              )}
                            </strong>

                          </div>


                          <div>

                            <span className="student-coaching-status-label">
                              コーチ
                            </span>


                            <strong>
                              {
                                item.coaches
                                  ?.name ||
                                "-"
                              }
                            </strong>

                          </div>

                        </div>


                        <div className="student-coaching-status-request">

                          <span className="student-coaching-status-label">
                            相談内容
                          </span>


                          <p>
                            {
                              item.request ||
                              "-"
                            }
                          </p>

                        </div>


                        {item.status ===
                          "cancelled" &&
                          item.cancelled_by ===
                            "coach" && (

                          <div className="student-coaching-rejection-reason">

                            <span className="student-coaching-status-label">
                              拒否理由
                            </span>


                            <p>
                              {
                                item.rejection_reason ||
                                "理由は登録されていません"
                              }
                            </p>

                          </div>

                        )}

                      </article>
                    );
                  }
                )}

              </div>

            )}

          </section>

        </>

      )}

    </div>
  );
}


export default StudentCoachingStatus;