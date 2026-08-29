import { NavLink } from "react-router-dom";

export default function StudentSidebar({
  student,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <h1>SF6 Coaching</h1>

      <nav>
        <NavLink
          to="/student"
          end
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          マイページ
        </NavLink>

        <NavLink
          to="/student/coaching/apply"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          コーチング申し込み
        </NavLink>

        <NavLink
          to="/student/coaching/history"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          コーチング履歴
        </NavLink>
      </nav>

      {student && (
        <div
          style={{
            marginTop: "32px",
            padding: "16px 10px",
            borderTop: "1px solid #3f3f46",
          }}
        >
          <div
            style={{
              marginBottom: "4px",
              color: "#a1a1aa",
              fontSize: "12px",
            }}
          >
            ログイン中
          </div>

          <strong
            style={{
              fontSize: "14px",
            }}
          >
            {student.name}
          </strong>
        </div>
      )}

      {onLogout && (
        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >
          ログアウト
        </button>
      )}
    </aside>
  );
}