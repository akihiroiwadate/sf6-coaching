import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentNew from "./pages/StudentNew";
import StudentDetail from "./pages/StudentDetail";
import CoachingNew from "./pages/CoachingNew";
import CoachDashboard from "./pages/CoachDashboard";
import StudentMyPage from "./pages/StudentMyPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* サイドバー */}
        <aside className="sidebar">
          <h1>SF6 Coaching</h1>

          <nav>
            {/* 管理 */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              ダッシュボード
            </NavLink>

            <NavLink
              to="/students"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              生徒一覧
            </NavLink>

            {/* コーチ */}
            <NavLink
              to="/coach"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              コーチ画面
            </NavLink>

            {/* 生徒 */}
            <NavLink
              to="/my"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              生徒マイページ
            </NavLink>
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="main">
          <Routes>
            {/* 管理ダッシュボード */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* 生徒一覧 */}
            <Route
              path="/students"
              element={<Students />}
            />

            {/* 生徒登録 */}
            <Route
              path="/students/new"
              element={<StudentNew />}
            />

            {/* コーチが見る生徒詳細 */}
            <Route
              path="/students/:id"
              element={<StudentDetail />}
            />

            {/* コーチング記録 */}
            <Route
              path="/students/:id/coaching/new"
              element={<CoachingNew />}
            />

            {/* コーチダッシュボード */}
            <Route
              path="/coach"
              element={<CoachDashboard />}
            />

            {/* 生徒マイページ */}
            <Route
              path="/my"
              element={<StudentMyPage />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;