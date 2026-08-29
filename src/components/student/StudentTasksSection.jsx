import {
  useEffect,
  useState,
} from "react";

import {
  supabase,
} from "../../supabase";


function StudentTasksSection({
  student,
  onUpdated,
  onSuccess,
  onError,
}) {
  const [
    selfTask,
    setSelfTask,
  ] = useState(
    student.self_task ??
    ""
  );

  const [
    saving,
    setSaving,
  ] = useState(false);


  useEffect(() => {
    setSelfTask(
      student.self_task ??
      ""
    );
  }, [
    student.self_task,
  ]);


  async function handleSave() {
    try {
      setSaving(
        true
      );


      const value =
        selfTask.trim() ||
        null;


      const {
        error,
      } =
        await supabase
          .from("students")
          .update({
            self_task:
              value,
          })
          .eq(
            "id",
            student.id
          );


      if (error) {
        throw error;
      }


      onUpdated({
        ...student,
        self_task:
          value,
      });


      onSuccess(
        "自分の課題を保存しました。"
      );

    } catch (error) {
      console.error(
        "課題更新エラー:",
        error
      );


      onError(
        `保存に失敗しました：${error.message}`
      );

    } finally {
      setSaving(
        false
      );
    }
  }


  return (
    <>

      <section className="content-card">

        <div className="section-title">
          <h3>
            コーチからの課題
          </h3>
        </div>

        <p>
          {student.task ||
            "未設定"}
        </p>

      </section>


      <section className="content-card">

        <div className="section-title">
          <h3>
            自分で決めた課題
          </h3>
        </div>


        <div className="form-group">

          <textarea
            value={
              selfTask
            }
            onChange={(
              event
            ) =>
              setSelfTask(
                event.target.value
              )
            }
            rows="4"
            placeholder="例：ランクマ10試合で対空を意識する"
          />

        </div>


        <button
          type="button"
          className="primary-button"
          onClick={
            handleSave
          }
          disabled={
            saving
          }
        >
          {saving
            ? "保存中..."
            : "課題を保存"}
        </button>

      </section>

    </>
  );
}


export default StudentTasksSection;