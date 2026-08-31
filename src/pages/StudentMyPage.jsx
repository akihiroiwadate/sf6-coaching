import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  supabase,
} from "../lib/supabase";

import StudentSelfTasks
  from "../components/student/StudentSelfTasks";

import CoachTasks
  from "../components/student/CoachTasks";

import "../styles/student/student.css";
import "../styles/student/student-mypage.css";
import "../styles/student/student-reward.css";
import "../styles/student/student-tasks.css";


/* =========================
   Reward Levels
========================= */

const REWARD_LEVELS = [
  {
    level: 1,
    minPoints: 0,
    name: "ルーキー",
  },
  {
    level: 2,
    minPoints: 100,
    name: "チャレンジャー",
  },
  {
    level: 3,
    minPoints: 300,
    name: "トレーニー",
  },
  {
    level: 4,
    minPoints: 500,
    name: "ファイター",
  },
  {
    level: 5,
    minPoints: 1000,
    name: "ウォリアー",
  },
  {
    level: 6,
    minPoints: 2000,
    name: "エリート",
  },
  {
    level: 7,
    minPoints: 3000,
    name: "スト6マスター",
  },
];


/* =========================
   Badges
========================= */

const BADGES = [
  {
    points: 100,
    icon: "🥉",
    name: "はじめの一歩",
  },
  {
    points: 500,
    icon: "🥈",
    name: "トレーニー",
  },
  {
    points: 1000,
    icon: "🥇",
    name: "ファイター",
  },
  {
    points: 3000,
    icon: "🏆",
    name: "スト6マスター",
  },
];


/* =========================
   Reward Functions
========================= */

function getRewardLevel(
  totalPoints
) {
  let currentLevel =
    REWARD_LEVELS[0];


  for (
    const level
    of REWARD_LEVELS
  ) {
    if (
      totalPoints >=
      level.minPoints
    ) {
      currentLevel =
        level;
    }
  }


  return currentLevel;
}


function getNextRewardLevel(
  totalPoints
) {
  return (
    REWARD_LEVELS.find(
      (level) =>
        level.minPoints >
        totalPoints
    ) || null
  );
}


function formatRewardDate(
  value
) {
  if (!value) {
    return "";
  }


  const date =
    new Date(value);


  return date.toLocaleDateString(
    "ja-JP",
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
  );
}


/* =========================
   StudentMyPage
========================= */

function StudentMyPage() {
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
    studentTasks,
    setStudentTasks,
  ] = useState([]);


  const [
    rewards,
    setRewards,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  const studentId =
    Number(id);


  /* =========================
     Initial Load
  ========================= */

  useEffect(() => {
    if (!id) {
      setErrorMessage(
        "生徒IDが指定されていません。"
      );

      setLoading(false);

      return;
    }


    if (
      Number.isNaN(
        Number(id)
      )
    ) {
      setErrorMessage(
        "生徒IDが正しくありません。"
      );

      setLoading(false);

      return;
    }


    fetchData();

  }, [id]);


  /* =========================
     All Data
  ========================= */

  async function fetchData() {
    setLoading(true);

    setErrorMessage("");


    const {
      data: studentData,
      error: studentError,
    } = await supabase
      .from("students")
      .select("*")
      .eq(
        "id",
        studentId
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


    await Promise.all([
      fetchCoachingRecords(),
      fetchStudentTasks(),
      fetchRewards(),
    ]);


    setLoading(false);
  }


  /* =========================
     Coaching Records
  ========================= */

  async function fetchCoachingRecords() {
    const {
      data,
      error,
    } = await supabase
      .from(
        "coaching_records"
      )
      .select("*")
      .eq(
        "student_id",
        studentId
      )
      .order(
        "date",
        {
          ascending: false,
        }
      );


    if (error) {
      console.error(
        "コーチング履歴取得エラー:",
        error
      );

      return;
    }


    setCoachingRecords(
      data ?? []
    );
  }


  /* =========================
     Student Tasks
  ========================= */

  async function fetchStudentTasks() {
    const {
      data,
      error,
    } = await supabase
      .from(
        "student_tasks"
      )
      .select("*")
      .eq(
        "student_id",
        studentId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );


    if (error) {
      console.error(
        "課題取得エラー:",
        error
      );

      return;
    }


    setStudentTasks(
      data ?? []
    );
  }


  /* =========================
     Rewards
  ========================= */

  async function fetchRewards() {
    const {
      data,
      error,
    } = await supabase
      .from(
        "reward_transactions"
      )
      .select(`
        id,
        student_id,
        points,
        reason,
        reward_type,
        related_id,
        created_at
      `)
      .eq(
        "student_id",
        studentId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );


    if (error) {
      console.error(
        "リワード取得エラー:",
        error
      );

      return;
    }


    setRewards(
      data ?? []
    );
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
     Error
  ========================= */

  if (errorMessage) {
    return (
      <div>

        <h2>
          データ取得エラー
        </h2>

        <p>
          {errorMessage}
        </p>

      </div>
    );
  }


  /* =========================
     Not Found
  ========================= */

  if (!student) {
    return (
      <div>

        <h2>
          マイページ
        </h2>

        <p>
          生徒情報が見つかりません。
        </p>

      </div>
    );
  }


  /* =========================
     Reward Calculation
  ========================= */

  const totalPoints =
    rewards.reduce(
      (
        total,
        reward
      ) =>
        total +
        Number(
          reward.points ||
          0
        ),

      0
    );


  const currentLevel =
    getRewardLevel(
      totalPoints
    );


  const nextLevel =
    getNextRewardLevel(
      totalPoints
    );


  const earnedBadges =
    BADGES.filter(
      (badge) =>
        totalPoints >=
        badge.points
    );


  let progressPercent =
    100;


  if (nextLevel) {
    const startPoints =
      currentLevel.minPoints;


    const endPoints =
      nextLevel.minPoints;


    progressPercent =
      (
        (
          totalPoints -
          startPoints
        ) /
        (
          endPoints -
          startPoints
        )
      ) * 100;


    progressPercent =
      Math.max(
        0,
        Math.min(
          100,
          progressPercent
        )
      );
  }


  /* =========================
     Task Filter
  ========================= */

  const coachTasks =
    studentTasks.filter(
      (task) =>
        task.task_type ===
        "coach"
    );


  const selfTasks =
    studentTasks.filter(
      (task) =>
        task.task_type ===
        "self"
    );


  /* =========================
     Render
  ========================= */

  return (
    <div className="student-my-page">

      {/* =====================
          Header
      ===================== */}

      <header>

        <div>

          <h2>
            マイページ
          </h2>

          <p>
            {student.name}
            さんの成長記録
          </p>

        </div>

      </header>


      {/* =====================
          Reward
      ===================== */}

      <section className="content-card reward-section">

        <div className="section-title">

          <div>

            <h3>
              リワード
            </h3>

            <p>
              コーチングや
              コーチからの課題を達成して
              ポイントを貯めよう
            </p>

          </div>

        </div>


        <div className="reward-main">

          <div className="reward-level-card">

            <span className="reward-level-label">
              LEVEL
            </span>


            <strong className="reward-level-number">
              {currentLevel.level}
            </strong>


            <span className="reward-level-name">
              {currentLevel.name}
            </span>

          </div>


          <div className="reward-progress-area">

            <div className="reward-point-row">

              <div>

                <span>
                  現在のポイント
                </span>

                <strong>
                  {totalPoints}

                  <small>
                    pt
                  </small>
                </strong>

              </div>


              {nextLevel && (

                <div className="reward-next-level">

                  <span>
                    次のLEVELまで
                  </span>

                  <strong>
                    {
                      nextLevel.minPoints -
                      totalPoints
                    }
                    pt
                  </strong>

                </div>

              )}

            </div>


            <div className="reward-progress">

              <div
                className="reward-progress-bar"
                style={{
                  width:
                    `${progressPercent}%`,
                }}
              />

            </div>


            <div className="reward-progress-text">

              <span>
                {totalPoints}
                pt
              </span>


              <span>
                {nextLevel
                  ? `${nextLevel.minPoints}pt`
                  : "MAX"}
              </span>

            </div>

          </div>

        </div>


        {/* =====================
            Badges
        ===================== */}

        <div className="reward-badge-area">

          <h4>
            獲得バッジ
          </h4>


          {earnedBadges.length ===
          0 ? (

            <p className="reward-empty-text">
              100pt貯めると
              最初のバッジを獲得できます
            </p>

          ) : (

            <div className="reward-badge-list">

              {earnedBadges.map(
                (badge) => (

                  <div
                    className="reward-badge"
                    key={
                      badge.name
                    }
                  >

                    <span className="reward-badge-icon">
                      {badge.icon}
                    </span>


                    <strong>
                      {badge.name}
                    </strong>


                    <small>
                      {badge.points}
                      pt
                    </small>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* =====================
            Reward History
        ===================== */}

        <div className="reward-history-area">

          <div className="reward-history-title">

            <h4>
              最近の獲得
            </h4>

            <span>
              {rewards.length}
              件
            </span>

          </div>


          {rewards.length ===
          0 ? (

            <p className="reward-empty-text">
              まだポイントを
              獲得していません
            </p>

          ) : (

            <div className="reward-history">

              {rewards
                .slice(
                  0,
                  5
                )
                .map(
                  (reward) => (

                    <div
                      className="reward-history-item"
                      key={
                        reward.id
                      }
                    >

                      <div>

                        <strong>
                          {reward.reason}
                        </strong>

                        <span>
                          {formatRewardDate(
                            reward.created_at
                          )}
                        </span>

                      </div>


                      <strong className="reward-history-points">

                        {reward.points >
                        0
                          ? "+"
                          : ""}

                        {reward.points}
                        pt

                      </strong>

                    </div>

                  )
                )}

            </div>

          )}

        </div>

      </section>


      {/* =====================
          Player Information
      ===================== */}

      <section className="content-card">

        <div className="section-title">

          <h3>
            プレイヤー情報
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


          <div>

            <span className="detail-label">
              担当コーチ
            </span>

            <strong>
              {student.coach ||
                "-"}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================
          Growth Summary
      ===================== */}

      <section className="content-card">

        <div className="section-title">

          <h3>
            成長サマリー
          </h3>

        </div>


        <div className="growth-summary">

          <div className="growth-card">

            <span>
              現在のMR
            </span>

            <strong>
              {student.mr ??
                "-"}
            </strong>

          </div>


          <div className="growth-card">

            <span>
              コーチング回数
            </span>

            <strong>
              {
                coachingRecords.length
              }
            </strong>

            <small>
              回
            </small>

          </div>


          <div className="growth-card">

            <span>
              現在のランク
            </span>

            <strong>
              {student.rank ||
                "-"}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================
          Goal
      ===================== */}

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


      {/* =====================
          Coach Tasks
      ===================== */}

      <CoachTasks
        tasks={
          coachTasks
        }
        onTasksChanged={
          fetchStudentTasks
        }
        onRewardChanged={
          fetchRewards
        }
      />


      {/* =====================
          Self Tasks
      ===================== */}

      <StudentSelfTasks
        studentId={
          student.id
        }
        tasks={
          selfTasks
        }
        onTasksChanged={
          fetchStudentTasks
        }
      />


      {/* =====================
          Coaching Request
      ===================== */}

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


      {/* =====================
          Game Availability
      ===================== */}

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


      {/* =====================
          Coaching Availability
      ===================== */}

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


      {/* =====================
          Coaching History
      ===================== */}

      <section className="content-card">

        <div className="section-title">

          <h3>
            これまでのコーチング
          </h3>

          <span>
            {
              coachingRecords.length
            }
            回
          </span>

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
                        今回の内容
                      </h4>

                      <p>
                        {record.match_content ||
                          "-"}
                      </p>

                    </div>


                    <div>

                      <h4>
                        良かったところ
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


export default StudentMyPage;