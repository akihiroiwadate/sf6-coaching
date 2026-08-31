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

import Avatar
  from "../components/common/Avatar";

import AvatarUploader
  from "../components/common/AvatarUploader";

import "../styles/coaching.css";
import "../styles/avatar.css";


const COACHING_TYPE_LABELS = {
  online: "オンライン",
  offline: "オフライン",
  replay: "リプレイのみ",
};


function formatDate(
  value
) {
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


function formatDateTime(
  value
) {
  if (!value) {
    return "-";
  }


  const date =
    new Date(value);


  return date.toLocaleString(
    "ja-JP",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


function getStudentName(
  item
) {
  return (
    item.students?.name ||
    `生徒ID：${item.student_id}`
  );
}


function getPreferredDateTime(
  item
) {
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


  return time
    ? `${date} ${time}`
    : date;
}


function CoachDashboard() {
  const [
    coach,
    setCoach,
  ] = useState(null);


  const [
    acceptedRequests,
    setAcceptedRequests,
  ] = useState([]);


  const [
    completedRequests,
    setCompletedRequests,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
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
    loadDashboard();
  }, []);


  async function loadDashboard() {
    try {
      setLoading(true);

      setError("");


      if (!coachId) {
        setCoach(null);

        setAcceptedRequests(
          []
        );

        setCompletedRequests(
          []
        );

        setError(
          "ログイン中のコーチIDを取得できません。ログアウトして、もう一度コーチでログインしてください。"
        );

        return;
      }


      await Promise.all([
        loadCoach(),
        loadRequests(),
      ]);

    } catch (err) {
      console.error(
        "担当コーチング取得エラー:",
        err
      );


      setError(
        `コーチング情報の取得に失敗しました。${
          err?.message
            ? ` ${err.message}`
            : ""
        }`
      );

    } finally {
      setLoading(false);
    }
  }


  /*
   * =========================
   * コーチ情報
   * =========================
   */

  async function loadCoach() {
    const {
      data,
      error: coachError,
    } = await supabase
      .from("coaches")
      .select(`
        id,
        name,
        avatar_path
      `)
      .eq(
        "id",
        Number(
          coachId
        )
      )
      .maybeSingle();


    if (coachError) {
      throw coachError;
    }


    setCoach(
      data || null
    );
  }


  /*
   * =========================
   * コーチアイコン更新
   * =========================
   */

  function handleCoachAvatarUploaded(
    avatarPath
  ) {
    setCoach(
      (
        currentCoach
      ) => {

        if (!currentCoach) {
          return currentCoach;
        }


        return {
          ...currentCoach,

          avatar_path:
            avatarPath,
        };
      }
    );
  }


  /*
   * =========================
   * コーチング情報
   * =========================
   */

  async function loadRequests() {

    /*
     * =========================
     * 担当中
     * =========================
     */

    const {
      data: acceptedData,
      error: acceptedError,
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
          coach_id,
          accepted_at,
          created_at,
          students (
            id,
            name,
            avatar_path
          )
        `)
        .eq(
          "status",
          "accepted"
        )
        .eq(
          "coach_id",
          Number(
            coachId
          )
        )
        .order(
          "accepted_at",
          {
            ascending: true,
          }
        );


    if (acceptedError) {
      throw acceptedError;
    }


    setAcceptedRequests(
      acceptedData || []
    );


    /*
     * =========================
     * 完了済み
     * =========================
     */

    const {
      data: completedData,
      error: completedError,
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
          coach_id,
          accepted_at,
          created_at,
          updated_at,
          students (
            id,
            name,
            avatar_path
          )
        `)
        .eq(
          "status",
          "completed"
        )
        .eq(
          "coach_id",
          Number(
            coachId
          )
        )
        .order(
          "updated_at",
          {
            ascending: false,
          }
        )
        .limit(10);


    if (completedError) {
      throw completedError;
    }


    setCompletedRequests(
      completedData || []
    );
  }


  /*
   * =========================
   * Loading
   * =========================
   */

  if (loading) {
    return (
      <div>

        <header>

          <div>

            <h2>
              担当コーチング
            </h2>


            <p>
              担当情報を
              読み込んでいます
            </p>

          </div>

        </header>

      </div>
    );
  }


  /*
   * =========================
   * Render
   * =========================
   */

  return (
    <div>

      {/* =====================
          コーチ情報
      ===================== */}

      <header>

        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              "14px",
          }}
        >

          {coach ? (

            <AvatarUploader
              userId={
                coach.id
              }
              name={
                coach.name
              }
              avatarPath={
                coach.avatar_path
              }
              userType="coach"
              tableName="coaches"
              onUploaded={
                handleCoachAvatarUploaded
              }
            />

          ) : (

            <Avatar
              name={
                coachName ||
                "コーチ"
              }
              avatarPath={
                null
              }
              type="coach"
              size="large"
            />

          )}


          <div>

            <h2>
              担当コーチング
            </h2>


            <p>
              {coach?.name ||
              coachName
                ? `${
                    coach?.name ||
                    coachName
                  }さんが担当しているコーチングです`
                : "あなたが担当しているコーチングです"}
            </p>

          </div>

        </div>

      </header>


      {error && (

        <p className="error-message">
          {error}
        </p>

      )}


      {/* =====================
          サマリー
      ===================== */}

      <div className="stats">

        <div className="stat-card">

          <span>
            担当中
          </span>


          <strong>
            {
              acceptedRequests.length
            }
          </strong>


          <small>
            件
          </small>

        </div>


        <div className="stat-card">

          <span>
            完了
          </span>


          <strong>
            {
              completedRequests.length
            }
          </strong>


          <small>
            件
          </small>

        </div>

      </div>


      {/* =====================
          担当中
      ===================== */}

      <section className="content-card">

        <div className="section-title">

          <div>

            <h3>
              対応中のコーチング
            </h3>


            <p>
              受諾済みで、
              これから対応するコーチングです
            </p>

          </div>


          <span>
            {
              acceptedRequests.length
            }
            件
          </span>

        </div>


        {acceptedRequests.length ===
        0 ? (

          <div
            style={{
              padding:
                "40px 20px",
              textAlign:
                "center",
            }}
          >

            <p>
              現在、担当中の
              コーチングはありません。
            </p>

          </div>

        ) : (

          <div className="coaching-history">

            {acceptedRequests.map(
              (item) => {

                const studentName =
                  getStudentName(
                    item
                  );


                return (
                  <div
                    key={
                      item.id
                    }
                    className="coaching-record"
                  >

                    {/* =====================
                        生徒情報
                    ===================== */}

                    <div className="coaching-record-header">

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap:
                            "12px",
                        }}
                      >

                        <Avatar
                          name={
                            studentName
                          }
                          avatarPath={
                            item.students
                              ?.avatar_path
                          }
                          type="student"
                          size="medium"
                        />


                        <div>

                          <strong>
                            {
                              studentName
                            }
                          </strong>


                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap:
                                "8px",
                              marginTop:
                                "4px",
                            }}
                          >

                            <span>
                              担当中
                            </span>


                            <span>
                              {
                                COACHING_TYPE_LABELS[
                                  item.coaching_type
                                ] ||
                                item.coaching_type
                              }
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>


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
                          リプレイID
                        </h4>


                        <p>
                          {item.replay_id ||
                            "なし"}
                        </p>

                      </div>


                      <div
                        style={{
                          gridColumn:
                            "1 / -1",
                        }}
                      >

                        <h4>
                          相談内容
                        </h4>


                        <p
                          style={{
                            whiteSpace:
                              "pre-wrap",
                          }}
                        >
                          {
                            item.request
                          }
                        </p>

                      </div>

                    </div>


                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "flex-end",
                        alignItems:
                          "center",
                        gap:
                          "12px",
                        padding:
                          "16px 20px",
                        borderTop:
                          "1px solid #e4e4e7",
                      }}
                    >

                      <Link
                        to={`/students/${item.student_id}`}
                        className="cancel-button"
                      >
                        生徒情報を見る
                      </Link>


                      <Link
                        to={`/students/${item.student_id}/coaching/new?requestId=${item.id}`}
                        className="primary-button"
                      >
                        結果を入力
                      </Link>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>


      {/* =====================
          完了済み
      ===================== */}

      <section className="content-card">

        <div className="section-title">

          <div>

            <h3>
              完了したコーチング
            </h3>


            <p>
              過去にあなたが
              対応したコーチングです
            </p>

          </div>


          <span>
            {
              completedRequests.length
            }
            件
          </span>

        </div>


        {completedRequests.length ===
        0 ? (

          <div
            style={{
              padding:
                "40px 20px",
              textAlign:
                "center",
            }}
          >

            <p>
              まだ完了した
              コーチングはありません。
            </p>

          </div>

        ) : (

          <div className="coaching-history">

            {completedRequests.map(
              (item) => {

                const studentName =
                  getStudentName(
                    item
                  );


                return (
                  <div
                    key={
                      item.id
                    }
                    className="coaching-record"
                  >

                    <div className="coaching-record-header">

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap:
                            "12px",
                        }}
                      >

                        <Avatar
                          name={
                            studentName
                          }
                          avatarPath={
                            item.students
                              ?.avatar_path
                          }
                          type="student"
                          size="medium"
                        />


                        <div>

                          <strong>
                            {
                              studentName
                            }
                          </strong>


                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap:
                                "8px",
                              marginTop:
                                "4px",
                            }}
                          >

                            <span>
                              完了
                            </span>


                            <span>
                              {
                                COACHING_TYPE_LABELS[
                                  item.coaching_type
                                ] ||
                                item.coaching_type
                              }
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>


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
                          完了日時
                        </h4>


                        <p>
                          {
                            formatDateTime(
                              item.updated_at
                            )
                          }
                        </p>

                      </div>


                      <div
                        style={{
                          gridColumn:
                            "1 / -1",
                        }}
                      >

                        <h4>
                          相談内容
                        </h4>


                        <p
                          style={{
                            whiteSpace:
                              "pre-wrap",
                          }}
                        >
                          {
                            item.request
                          }
                        </p>

                      </div>

                    </div>


                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "flex-end",
                        padding:
                          "16px 20px",
                        borderTop:
                          "1px solid #e4e4e7",
                      }}
                    >

                      <Link
                        to={`/students/${item.student_id}`}
                        className="cancel-button"
                      >
                        生徒情報を見る
                      </Link>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>

    </div>
  );
}


export default CoachDashboard;