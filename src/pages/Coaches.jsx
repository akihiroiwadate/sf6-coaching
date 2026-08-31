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

import Avatar
  from "../components/common/Avatar";

import "../styles/admin.css";


function Coaches() {
  const navigate =
    useNavigate();

  const [
    coaches,
    setCoaches,
  ] = useState([]);

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
    fetchData();
  }, []);


  async function fetchData() {
    setLoading(true);
    setErrorMessage("");


    const {
      data: coachData,
      error: coachError,
    } = await supabase
      .from("coaches")
      .select("*")
      .order(
        "id",
        {
          ascending: true,
        }
      );


    if (coachError) {
      console.error(
        "コーチ取得エラー:",
        coachError
      );

      setErrorMessage(
        coachError.message
      );

      setLoading(false);

      return;
    }


    const {
      data: studentData,
      error: studentError,
    } = await supabase
      .from("students")
      .select(
        "id, name, coach"
      );


    if (studentError) {
      console.error(
        "生徒取得エラー:",
        studentError
      );

      setErrorMessage(
        studentError.message
      );

      setLoading(false);

      return;
    }


    setCoaches(
      coachData ?? []
    );

    setStudents(
      studentData ?? []
    );

    setLoading(false);
  }


  function getStudentCount(
    coachName
  ) {
    return students.filter(
      (student) =>
        student.coach ===
        coachName
    ).length;
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


  return (
    <div className="coaches-page">

      <header>

        <div>

          <h2>
            コーチ一覧
          </h2>

          <p>
            登録されているコーチを確認できます
          </p>

        </div>


        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate(
              "/coaches/new"
            )
          }
        >
          ＋ コーチを追加
        </button>

      </header>


      <section className="content-card">

        <div className="section-title">

          <h3>
            コーチ
          </h3>

          <span>
            {coaches.length}人
          </span>

        </div>


        {coaches.length === 0 ? (

          <p>
            コーチが登録されていません。
          </p>

        ) : (

          <div className="coaches-table-wrapper">

            <table className="coaches-table">

              <thead>

                <tr>

                  <th className="coach-name-column">
                    コーチ名
                  </th>

                  <th className="coach-id-column">
                    プレイヤーID
                  </th>

                  <th className="coach-character-column">
                    メインキャラ
                  </th>

                  <th className="coach-rank-column">
                    ランク
                  </th>

                  <th className="coach-mr-column">
                    MR
                  </th>

                  <th className="coach-specialty-column">
                    得意分野
                  </th>

                  <th className="coach-students-column">
                    担当生徒
                  </th>

                </tr>

              </thead>


              <tbody>

                {coaches.map(
                  (coach) => (

                    <tr
                      key={
                        coach.id
                      }
                    >

                      <td>

                        <div className="user-name-cell">

                          <Avatar
                            name={
                              coach.name
                            }
                            avatarPath={
                              coach.avatar_path
                            }
                            type="coach"
                            size="medium"
                          />


                          <button
                            type="button"
                            className="coach-name-link"
                            onClick={() =>
                              navigate(
                                `/coaches/${coach.id}`
                              )
                            }
                          >
                            {coach.name}
                          </button>

                        </div>

                      </td>


                      <td className="coach-player-id">
                        {coach.sf6_player_id ||
                          "-"}
                      </td>


                      <td className="coach-character">
                        {coach.main_character ||
                          "-"}
                      </td>


                      <td>

                        <span className="rank">
                          {coach.rank ||
                            "-"}
                        </span>

                      </td>


                      <td className="coach-mr">
                        {coach.mr ??
                          "-"}
                      </td>


                      <td className="coach-specialty">
                        {coach.specialty ||
                          "-"}
                      </td>


                      <td className="coach-student-count">

                        <strong>
                          {getStudentCount(
                            coach.name
                          )}
                        </strong>

                        <span>
                          人
                        </span>

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


export default Coaches;