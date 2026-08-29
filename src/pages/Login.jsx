import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../supabase";

import "../styles/login.css";

export default function Login() {
  const navigate =
    useNavigate();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const clearLoginInfo =
    () => {
      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "studentId"
      );

      localStorage.removeItem(
        "studentName"
      );

      localStorage.removeItem(
        "coachId"
      );

      localStorage.removeItem(
        "coachName"
      );
    };

  const loginAsStudent =
    async () => {
      try {
        setLoading(true);
        setError("");

        clearLoginInfo();

        const {
          data,
          error:
            studentError,
        } =
          await supabase
            .from("students")
            .select(
              "id, name"
            )
            .order("id", {
              ascending: true,
            })
            .limit(1)
            .single();

        if (
          studentError
        ) {
          throw studentError;
        }

        if (!data) {
          throw new Error(
            "生徒データがありません"
          );
        }

        localStorage.setItem(
          "role",
          "student"
        );

        localStorage.setItem(
          "studentId",
          String(data.id)
        );

        localStorage.setItem(
          "studentName",
          data.name || ""
        );

        navigate(
          `/mypage/${data.id}`,
          {
            replace: true,
          }
        );
      } catch (err) {
        console.error(
          err
        );

        setError(
          `生徒ログインに失敗しました。${
            err?.message
              ? ` ${err.message}`
              : ""
          }`
        );
      } finally {
        setLoading(false);
      }
    };

  const loginAsCoach =
    async () => {
      try {
        setLoading(true);
        setError("");

        clearLoginInfo();

        const {
          data,
          error:
            coachError,
        } =
          await supabase
            .from("coaches")
            .select(
              "id, name"
            )
            .order("id", {
              ascending: true,
            })
            .limit(1)
            .single();

        if (coachError) {
          throw coachError;
        }

        if (!data) {
          throw new Error(
            "コーチデータがありません"
          );
        }

        localStorage.setItem(
          "role",
          "coach"
        );

        localStorage.setItem(
          "coachId",
          String(data.id)
        );

        localStorage.setItem(
          "coachName",
          data.name || ""
        );

        navigate(
          "/coach",
          {
            replace: true,
          }
        );
      } catch (err) {
        console.error(
          err
        );

        setError(
          `コーチログインに失敗しました。${
            err?.message
              ? ` ${err.message}`
              : ""
          }`
        );
      } finally {
        setLoading(false);
      }
    };

  const loginAsAdmin =
    () => {
      setError("");

      clearLoginInfo();

      localStorage.setItem(
        "role",
        "admin"
      );

      navigate(
        "/admin",
        {
          replace: true,
        }
      );
    };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>
          SF6 Coaching
        </h1>

        <p className="login-description">
          ログインするユーザーを
          選択してください
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <div className="login-buttons">
          <button
            type="button"
            className="student-login-button"
            onClick={
              loginAsStudent
            }
            disabled={loading}
          >
            生徒としてログイン
          </button>

          <button
            type="button"
            className="coach-login-button"
            onClick={
              loginAsCoach
            }
            disabled={loading}
          >
            コーチとしてログイン
          </button>

          <button
            type="button"
            className="admin-login-button"
            onClick={
              loginAsAdmin
            }
            disabled={loading}
          >
            管理者としてログイン
          </button>
        </div>

        {loading && (
          <p className="login-loading">
            ログインしています...
          </p>
        )}
      </div>
    </div>
  );
}