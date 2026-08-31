import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./styles/app.css";
import "./styles/coach.css";
import "./styles/admin.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Students from "./pages/Students";
import StudentNew from "./pages/StudentNew";
import StudentDetail from "./pages/StudentDetail";
import StudentMyPage from "./pages/StudentMyPage";
import StudentCoachingStatus from "./pages/StudentCoachingStatus";

import Coaches from "./pages/Coaches";
import CoachNew from "./pages/CoachNew";
import CoachDetail from "./pages/CoachDetail";

import CoachDashboard from "./pages/CoachDashboard";
import CoachRequests from "./pages/CoachRequests";

import CoachingNew from "./pages/CoachingNew";
import CoachingApply from "./pages/CoachingApply";


function RoleRoute({
  allowedRoles,
  children,
}) {
  const role =
    localStorage.getItem("role");

  const studentId =
    localStorage.getItem("studentId");

  if (!role) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles.includes(role)
  ) {
    return children;
  }

  if (role === "student") {
    if (studentId) {
      return (
        <Navigate
          to={`/mypage/${studentId}`}
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (role === "coach") {
    return (
      <Navigate
        to="/coach"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/admin"
      replace
    />
  );
}


function MainLayout({
  children,
}) {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const role =
    localStorage.getItem("role");

  const studentId =
    localStorage.getItem("studentId");

  const studentName =
    localStorage.getItem("studentName");

  const coachName =
    localStorage.getItem("coachName");


  function handleLogout() {
    localStorage.removeItem("role");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
    localStorage.removeItem("coachId");
    localStorage.removeItem("coachName");

    navigate("/login");
  }


  function isActive(path) {
    return (
      location.pathname === path
    );
  }


  return (
    <div
      className={`app-layout role-${role}`}
    >

      <aside className="sidebar">

        <div className="sidebar-logo">

          <h1>
            SF6 Coaching
          </h1>

          <p>
            Coaching Management
          </p>

        </div>


        <div className="sidebar-user">

          {role === "student" && (
            <>

              <span>
                生徒
              </span>

              <strong>
                {studentName ||
                  "ログイン中"}
              </strong>

            </>
          )}


          {role === "coach" && (
            <>

              <span>
                コーチ
              </span>

              <strong>
                {coachName ||
                  "ログイン中"}
              </strong>

            </>
          )}


          {role === "admin" && (
            <>

              <span>
                管理者
              </span>

              <strong>
                管理者
              </strong>

            </>
          )}

        </div>


        <nav className="sidebar-nav">

          {role === "student" && (
            <>

              <Link
                to={`/mypage/${studentId}`}
                className={
                  isActive(
                    `/mypage/${studentId}`
                  )
                    ? "active"
                    : ""
                }
              >
                マイページ
              </Link>


              <Link
                to="/coaching/apply"
                className={
                  isActive(
                    "/coaching/apply"
                  )
                    ? "active"
                    : ""
                }
              >
                コーチング申し込み
              </Link>


              <Link
                to="/student/coaching/status"
                className={
                  isActive(
                    "/student/coaching/status"
                  )
                    ? "active"
                    : ""
                }
              >
                申込状況
              </Link>

            </>
          )}


          {role === "coach" && (
            <>

              <Link
                to="/coach/requests"
                className={
                  isActive(
                    "/coach/requests"
                  )
                    ? "active"
                    : ""
                }
              >
                新しい申し込み
              </Link>


              <Link
                to="/coach"
                className={
                  isActive(
                    "/coach"
                  )
                    ? "active"
                    : ""
                }
              >
                担当コーチング
              </Link>

            </>
          )}


          {role === "admin" && (
            <>

              <Link
                to="/admin"
                className={
                  isActive(
                    "/admin"
                  )
                    ? "active"
                    : ""
                }
              >
                ダッシュボード
              </Link>


              <Link
                to="/students"
                className={
                  location.pathname.startsWith(
                    "/students"
                  )
                    ? "active"
                    : ""
                }
              >
                生徒管理
              </Link>


              <Link
                to="/coaches"
                className={
                  location.pathname.startsWith(
                    "/coaches"
                  )
                    ? "active"
                    : ""
                }
              >
                コーチ管理
              </Link>

            </>
          )}

        </nav>


        <div className="sidebar-footer">

          <button
            type="button"
            onClick={
              handleLogout
            }
          >
            ログアウト
          </button>

        </div>

      </aside>


      <main className="main-content">
        {children}
      </main>

    </div>
  );
}


function AppRoutes() {
  const role =
    localStorage.getItem("role");

  const studentId =
    localStorage.getItem("studentId");


  function getHomePath() {
    if (
      role === "student"
    ) {
      return studentId
        ? `/mypage/${studentId}`
        : "/login";
    }

    if (
      role === "coach"
    ) {
      return "/coach";
    }

    if (
      role === "admin"
    ) {
      return "/admin";
    }

    return "/login";
  }


  return (
    <Routes>

      <Route
        path="/login"
        element={
          <Login />
        }
      />


      <Route
        path="/admin"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <Dashboard />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/students"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <Students />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/students/new"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <StudentNew />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/students/:id"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "admin",
                "coach",
              ]}
            >
              <StudentDetail />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/students/:id/coaching/new"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "coach",
                "admin",
              ]}
            >
              <CoachingNew />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/coaches"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <Coaches />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/coaches/new"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <CoachNew />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/coaches/:id"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <CoachDetail />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/coach"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "coach",
              ]}
            >
              <CoachDashboard />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/coach/requests"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "coach",
              ]}
            >
              <CoachRequests />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/mypage/:id"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "student",
              ]}
            >
              <StudentMyPage />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/coaching/apply"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "student",
              ]}
            >
              <CoachingApply />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/student/coaching/status"
        element={
          <MainLayout>

            <RoleRoute
              allowedRoles={[
                "student",
              ]}
            >
              <StudentCoachingStatus />
            </RoleRoute>

          </MainLayout>
        }
      />


      <Route
        path="/"
        element={
          <Navigate
            to={
              getHomePath()
            }
            replace
          />
        }
      />


      <Route
        path="*"
        element={
          <Navigate
            to={
              getHomePath()
            }
            replace
          />
        }
      />

    </Routes>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


export default App;