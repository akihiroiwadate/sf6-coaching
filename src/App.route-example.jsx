import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CoachingApply from "./pages/CoachingApply";

/*
  既存の App.jsx に追加するルートの完全な最小例です。

  student はログイン後に取得している生徒情報を渡してください。
  例:
    <CoachingApply student={currentStudent} />

  既存プロジェクトの画面構成に合わせて currentStudent の取得部分だけ
  現在の認証実装へ接続してください。
*/

export default function App() {
  const currentStudent = null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/student/coaching/apply"
          element={<CoachingApply student={currentStudent} />}
        />

        <Route
          path="*"
          element={<Navigate to="/student/coaching/apply" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
