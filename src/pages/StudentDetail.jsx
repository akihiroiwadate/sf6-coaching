import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  supabase,
} from "../lib/supabase";

import Avatar
  from "../components/common/Avatar";

import "../styles/avatar.css";


function StudentDetail() {
  const navigate =
    useNavigate();


  const {
    id,
  } = useParams();


  const [
    student,
    setStudent,
  ] = useState(null);


  const [
    coachingRecords,
    setCoachingRecords,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  useEffect(() => {
    fetchData();
  }, [
    id,
  ]);


  async function fetchData() {
    setLoading(true);

    setErrorMessage("");


    const {
      data: studentData,
      error: studentError,
    } =
      await supabase
        .from("students")
        .select("*")
        .eq(
          "id",
          id
        )
        .maybeSingle();


    if (studentError) {
      console.error(
        "生徒情報取得エラー:",
        studentError
      );


      setErrorMessage(
        studentError.message
      );


      setLoading(false);

      return;
    }


    if (!studentData) {
      setStudent(null);

      setLoading(false);

      return;
    }


    setStudent(
      studentData
    );


    const {
      data: recordData,
      error: recordError,
    } =
      await supabase
        .from(
          "coaching_records"
        )
        .select("*")
        .eq(
          "student_id",
          id
        )
        .order(
          "date",
          {
            ascending:
              false,
          }
        );


    if (recordError) {
      console.error(
        "コーチング履歴取得エラー:",
        recordError
      );


      setErrorMessage(
        recordError.message
      );

    } else {
      setCoachingRecords(
        recordData ?? []
      );
    }


    setLoading(false);
  }


  if (loading) {
    return (
      <p>
        読み込み中...
      </p>
    );
  }


  if (errorMessage) {
    return (
      <div>

        <h2>
          データ取得エラー
        </h2>


        <p>
          {errorMessage}
        </p>


        <button
          type="button"
          className="cancel-button"
          onClick={() =>
            navigate("/coach")
          }
        >
          担当コーチングに戻る
        </button>

      </div>
    );
  }


  if (!student) {
    return (
      <div>

        <h2>
          生徒が見つかりません
        </h2>


        <button
          type="button"
          className="cancel-button"
          onClick={() =>
            navigate("/coach")
          }
        >
          担当コーチングに戻る
        </button>

      </div>
    );
  }


  return (
    <div>

      {/* =========================
          Header
      ========================= */}

      <header>

        <div className="user-name-cell">

          <Avatar
            name={
              student.name
            }
            avatarPath={
              student.avatar_path
            }
            type="student"
            size="medium"
          />


          <div>

            <h2>
              {student.name}
            </h2>


            <p>
              コーチ用 生徒詳細
            </p>

          </div>

        </div>


        <div className="header-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              navigate("/coach")
            }
          >
            担当コーチングに戻る
          </button>

        </div>

      </header>


      {/* =========================
          Basic Info
      ========================= */}

      <section className="content-card">

        <div className="section-title">

          <h3>
            基本情報
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
              スト6 プレイヤーID
            </span>


            <strong>
              {student.player_id ||
                "-"}
            </strong>

          </div>


          <div>

            <span className="detail-label">
              担当コーチ
            </span>


            <strong>
              {student.coach ||
                "-"}
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
              ランク
            </span>


            <strong>
              {student.rank ||
                "-"}
            </strong>

          </div>


          <div>

            <span className="detail-label">
              MR
            </span>


            <strong>
              {student.mr ??
                "-"}
            </strong>

          </div>

        </div>

      </section>


      {/* =========================
          Goal
      ========================= */}

      <section className="content-card">

        <div className="section-title">

          <h3>
            目標
          </h3>

        </div>


        <p>
          {student.goal ||
            "未設定"}
        </p>

      </section>


      {/* =========================
          Coaching Request
      ========================= */}

      <section className="content-card">

        <div className="section-title">

          <h3>
            コーチング要望
          </h3>

        </div>


        <p>
          {student.request ||
            "未設定"}
        </p>

      </section>


      {/* =========================
          Current Task
      ========================= */}

      <section className="content-card">

        <div className="section-title">

          <h3>
            現在の課題
          </h3>

        </div>


        <p>
          {student.task ||
            "未設定"}
        </p>

      </section>


      {/* =========================
          Game Availability
      ========================= */}

      <section className="content-card">

        <div className="section-title">

          <h3>
            ゲームをプレイできる時間
          </h3>

        </div>


        <p>
          {student.game_availability ||
            "未設定"}
        </p>

      </section>


      {/* =========================
          Coaching Availability
      ========================= */}

      <section className="content-card">

        <div className="section-title">

          <h3>
            コーチングを受けられる時間
          </h3>

        </div>


        <p>
          {
            student.coaching_availability ||
            "未設定"
          }
        </p>

      </section>


      {/* =========================
          Coaching History
      ========================= */}

      <section className="content-card">

        <div className="section-title">

          <div>

            <h3>
              コーチング履歴
            </h3>


            <span>
              {coachingRecords.length}
              件
            </span>

          </div>

        </div>


        {coachingRecords.length ===
        0 ? (

          <p>
            まだコーチング記録がありません。
          </p>

        ) : (

          <div className="coaching-history">

            {coachingRecords.map(
              (record) => (

                <div
                  className="coaching-record"
                  key={
                    record.id
                  }
                >

                  <div className="coaching-record-header">

                    <div>

                      <strong>
                        {record.date}
                      </strong>


                      <span>
                        {record.coach ||
                          ""}
                      </span>

                    </div>

                  </div>


                  <div className="coaching-record-content">

                    <div>

                      <h4>
                        対戦内容
                      </h4>


                      <p>
                        {record.match_content ||
                          "-"}
                      </p>

                    </div>


                    <div>

                      <h4>
                        良かった点
                      </h4>


                      <p>
                        {record.good_points ||
                          "-"}
                      </p>

                    </div>


                    <div>

                      <h4>
                        改善ポイント
                      </h4>


                      <p>
                        {
                          record.improvement_points ||
                          "-"
                        }
                      </p>

                    </div>


                    <div>

                      <h4>
                        次回までの課題
                      </h4>


                      <p>
                        {record.next_task ||
                          "-"}
                      </p>

                    </div>


                    {record.memo && (

                      <div>

                        <h4>
                          コーチメモ
                        </h4>


                        <p>
                          {record.memo}
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}


export default StudentDetail;