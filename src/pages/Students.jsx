import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  supabase,
} from "../lib/supabase";

import "../styles/admin.css";


function Students() {
  const navigate =
    useNavigate();

  const [
    students,
    setStudents,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  useEffect(() => {
    fetchStudents();
  }, []);


  async function fetchStudents() {
    setLoading(true);
    setErrorMessage("");


    const {
      data,
      error,
    } = await supabase
      .from("students")
      .select("*")
      .order(
        "id",
        {
          ascending: true,
        }
      );


    if (error) {
      console.error(
        "生徒データの取得に失敗しました",
        error
      );

      setErrorMessage(
        error.message
      );

      setStudents([]);

    } else {
      setStudents(
        data ?? []
      );
    }


    setLoading(false);
  }


  if (loading) {
    return (
      <p>
        読み込み中...
      </p>
    );
  }


  return (
    <div className="students-page">

      <header>

        <div>

          <h2>
            生徒一覧
          </h2>

          <p>
            登録されている生徒を確認できます
          </p>

        </div>


        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate(
              "/students/new"
            )
          }
        >
          ＋ 生徒を追加
        </button>

      </header>


      {errorMessage && (

        <section className="content-card">

          <h3>
            データ取得エラー
          </h3>

          <p>
            {errorMessage}
          </p>

        </section>

      )}


      <section className="content-card">

        <div className="section-title">

          <h3>
            生徒
          </h3>

          <span>
            {students.length}人
          </span>

        </div>


        {students.length === 0 ? (

          <p>
            生徒が登録されていません。
          </p>

        ) : (

          <div className="students-table-wrapper">

            <table className="students-table">

              <thead>

                <tr>

                  <th className="student-name-column">
                    プレイヤー
                  </th>

                  <th className="student-id-column">
                    プレイヤーID
                  </th>

                  <th className="student-coach-column">
                    担当コーチ
                  </th>

                  <th className="student-character-column">
                    使用キャラ
                  </th>

                  <th className="student-rank-column">
                    ランク
                  </th>

                  <th className="student-mr-column">
                    MR
                  </th>

                  <th className="student-task-column">
                    現在の課題
                  </th>

                </tr>

              </thead>


              <tbody>

                {students.map(
                  (student) => (

                    <tr
                      key={
                        student.id
                      }
                    >

                      <td>

                        <button
                          type="button"
                          className="student-name-link"
                          onClick={() =>
                            navigate(
                              `/students/${student.id}`
                            )
                          }
                        >
                          {student.name}
                        </button>

                      </td>


                      <td className="student-player-id">
                        {student.player_id ||
                          "-"}
                      </td>


                      <td className="student-coach">
                        {student.coach ||
                          "-"}
                      </td>


                      <td className="student-character">
                        {student.character ||
                          "-"}
                      </td>


                      <td className="student-rank">

                        <span className="rank">
                          {student.rank ||
                            "-"}
                        </span>

                      </td>


                      <td className="student-mr">
                        {student.mr ??
                          "-"}
                      </td>


                      <td className="student-task">
                        {student.task ||
                          "-"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}


export default Students;