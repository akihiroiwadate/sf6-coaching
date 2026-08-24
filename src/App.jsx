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
import Coaches from "./pages/Coaches";
import CoachNew from "./pages/CoachNew";
import CoachDetail from "./pages/CoachDetail";
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

            <NavLink
              to="/coaches"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              コーチ一覧
            </NavLink>

            <NavLink
              to="/coach"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              コーチ画面
            </NavLink>

            {/* 開発確認用 */}
            <NavLink
              to="/mypage/4"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              生徒マイページ
            </NavLink>
          </nav>
        </aside>

        {/* メイン */}
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

            {/* 生徒詳細 */}
            <Route
              path="/students/:id"
              element={<StudentDetail />}
            />

            {/* コーチング記録 */}
            <Route
              path="/students/:id/coaching/new"
              element={<CoachingNew />}
            />

            {/* コーチ一覧 */}
            <Route
              path="/coaches"
              element={<Coaches />}
            />

            {/* コーチ登録 */}
            <Route
              path="/coaches/new"
              element={<CoachNew />}
            />

            {/* コーチ詳細 */}
            <Route
              path="/coaches/:id"
              element={<CoachDetail />}
            />

            {/* コーチ画面 */}
            <Route
              path="/coach"
              element={<CoachDashboard />}
            />

            {/* 生徒マイページ */}
            <Route
              path="/mypage/:id"
              element={<StudentMyPage />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;