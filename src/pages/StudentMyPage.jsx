import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  supabase,
} from "../supabase";

import StudentGrowthSummary from "../components/student/StudentGrowthSummary";
import StudentProfileSection from "../components/student/StudentProfileSection";
import StudentTasksSection from "../components/student/StudentTasksSection";
import CoachingHistory from "../components/student/CoachingHistory";

import "../styles/coaching.css";


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
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  useEffect(() => {
    if (!id) {
      setErrorMessage(
        "生徒IDが指定されていません。"
      );

      setLoading(false);

      return;
    }

    fetchData();
  }, [id]);


  async function fetchData() {
    setLoading(true);
    setErrorMessage("");

    const studentId =
      Number(id);

    if (
      Number.isNaN(
        studentId
      )
    ) {
      setErrorMessage(
        "生徒IDが正しくありません。"
      );

      setLoading(false);

      return;
    }


    const {
      data: studentData,
      error: studentError,
    } =
      await supabase
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
          studentId
        )
        .order(
          "date",
          {
            ascending: false,
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


  function handleStudentUpdated(
    updatedStudent
  ) {
    setStudent(
      updatedStudent
    );
  }


  function showSuccess(
    message
  ) {
    setSuccessMessage(
      message
    );

    setErrorMessage("");
  }


  function showError(
    message
  ) {
    setErrorMessage(
      message
    );

    setSuccessMessage("");
  }


  if (loading) {
    return (
      <p>
        読み込み中...
      </p>
    );
  }


  if (
    errorMessage &&
    !student
  ) {
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


  return (
    <div className="student-my-page">

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


      {successMessage && (
        <div
          className="content-card"
          style={{
            borderColor:
              "#86efac",
            background:
              "#f0fdf4",
            color:
              "#166534",
          }}
        >
          {successMessage}
        </div>
      )}


      {errorMessage && (
        <p className="error-message">
          {errorMessage}
        </p>
      )}


      <StudentGrowthSummary
        student={student}
        coachingRecords={
          coachingRecords
        }
      />


      <StudentProfileSection
        student={student}
        onUpdated={
          handleStudentUpdated
        }
        onSuccess={
          showSuccess
        }
        onError={
          showError
        }
      />


      <StudentTasksSection
        student={student}
        onUpdated={
          handleStudentUpdated
        }
        onSuccess={
          showSuccess
        }
        onError={
          showError
        }
      />


      <CoachingHistory
        coachingRecords={
          coachingRecords
        }
      />

    </div>
  );
}


export default StudentMyPage;