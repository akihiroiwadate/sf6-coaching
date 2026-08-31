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

import StudentProfileHeader
  from "../components/student/StudentProfileHeader";

import StudentRewardSection
  from "../components/student/StudentRewardSection";

import StudentPlayerInfo
  from "../components/student/StudentPlayerInfo";

import StudentGrowthSummary
  from "../components/student/StudentGrowthSummary";

import StudentProfileDetails
  from "../components/student/StudentProfileDetails";

import StudentCoachingHistory
  from "../components/student/StudentCoachingHistory";

import CoachTasks
  from "../components/student/CoachTasks";

import StudentSelfTasks
  from "../components/student/StudentSelfTasks";

import "../styles/student/student.css";
import "../styles/student/student-mypage.css";
import "../styles/student/student-reward.css";
import "../styles/student/student-tasks.css";
import "../styles/avatar.css";


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
        studentId
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


  async function fetchCoachingRecords() {
    const {
      data,
      error,
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


  async function fetchStudentTasks() {
    const {
      data,
      error,
    } =
      await supabase
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


  async function fetchRewards() {
    const {
      data,
      error,
    } =
      await supabase
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


  return (
    <div className="student-my-page">

      <StudentProfileHeader
        student={
          student
        }
        rewards={
          rewards
        }
        onStudentUpdated={
          setStudent
        }
      />


      <StudentRewardSection
        rewards={
          rewards
        }
      />


      <StudentPlayerInfo
        student={
          student
        }
        onUpdated={
          setStudent
        }
      />


      <StudentGrowthSummary
        student={
          student
        }
        coachingRecords={
          coachingRecords
        }
      />


      <StudentProfileDetails
        student={
          student
        }
        onUpdated={
          setStudent
        }
      />


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


      <StudentCoachingHistory
        records={
          coachingRecords
        }
      />

    </div>
  );
}


export default StudentMyPage;