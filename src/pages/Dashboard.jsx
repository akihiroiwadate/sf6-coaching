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

export default function Dashboard() {
  const [
    studentCount,
    setStudentCount,
  ] = useState(0);

  const [
    coachCount,
    setCoachCount,
  ] = useState(0);

  const [
    pendingCount,
    setPendingCount,
  ] = useState(0);

  const [
    acceptedCount,
    setAcceptedCount,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard =
    async () => {
      try {
        setLoading(true);
        setError("");

        const [
          studentsResult,
          coachesResult,
          pendingResult,
          acceptedResult,
        ] =
          await Promise.all([
            supabase
              .from("students")
              .select("*", {
                count: "exact",
                head: true,
              }),

            supabase
              .from("coaches")
              .select("*", {
                count: "exact",
                head: true,
              }),

            supabase
              .from(
                "coaching_requests"
              )
              .select("*", {
                count: "exact",
                head: true,
              })
              .eq(
                "status",
                "pending"
              ),

            supabase
              .from(
                "coaching_requests"
              )
              .select("*", {
                count: "exact",
                head: true,
              })
              .eq(
                "status",
                "accepted"
              ),
          ]);

        if (
          studentsResult.error
        ) {
          throw studentsResult.error;
        }

        if (
          coachesResult.error
        ) {
          throw coachesResult.error;
        }

        if (
          pendingResult.error
        ) {
          throw pendingResult.error;
        }

        if (
          acceptedResult.error
        ) {
          throw acceptedResult.error;
        }

        setStudentCount(
          studentsResult.count || 0
        );

        setCoachCount(
          coachesResult.count || 0
        );

        setPendingCount(
          pendingResult.count || 0
        );

        setAcceptedCount(
          acceptedResult.count || 0
        );
      } catch (err) {
        console.error(err);

        setError(
          `ダッシュボードの取得に失敗しました。${
            err?.message
              ? ` ${err.message}`
              : ""
          }`
        );
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div>
        <header>
          <div>
            <h2>
              管理者ダッシュボード
            </h2>

            <p>
              データを読み込んでいます
            </p>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div>
      <header>
        <div>
          <h2>
            管理者ダッシュボード
          </h2>

          <p>
            SF6 Coachingの運営状況を
            確認できます
          </p>
        </div>
      </header>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <div className="stats">
        <div className="stat-card">
          <span>
            登録生徒
          </span>

          <strong>
            {studentCount}
          </strong>

          <small>
            人
          </small>
        </div>

        <div className="stat-card">
          <span>
            登録コーチ
          </span>

          <strong>
            {coachCount}
          </strong>

          <small>
            人
          </small>
        </div>

        <div className="stat-card">
          <span>
            未受諾の申し込み
          </span>

          <strong>
            {pendingCount}
          </strong>

          <small>
            件
          </small>
        </div>
      </div>

      <section className="content-card">
        <div className="section-title">
          <h3>
            コーチング状況
          </h3>
        </div>

        <div className="student-detail-grid">
          <div>
            <span className="detail-label">
              未受諾
            </span>

            <strong>
              {pendingCount}件
            </strong>
          </div>

          <div>
            <span className="detail-label">
              受諾済み
            </span>

            <strong>
              {acceptedCount}件
            </strong>
          </div>

          <div>
            <span className="detail-label">
              合計
            </span>

            <strong>
              {pendingCount +
                acceptedCount}
              件
            </strong>
          </div>
        </div>
      </section>

      <section className="content-card">
        <div className="section-title">
          <h3>
            管理
          </h3>

          <span>
            管理する項目を選択
          </span>
        </div>

        <div className="coaching-item">
          <div>
            <strong>
              生徒管理
            </strong>

            <p>
              生徒の登録情報や
              コーチング履歴を確認します
            </p>
          </div>

          <Link
            to="/students"
            className="primary-button"
          >
            生徒を見る
          </Link>
        </div>

        <div className="coaching-item">
          <div>
            <strong>
              コーチ管理
            </strong>

            <p>
              コーチの登録や
              情報を管理します
            </p>
          </div>

          <Link
            to="/coaches"
            className="primary-button"
          >
            コーチを見る
          </Link>
        </div>
      </section>
    </div>
  );
}