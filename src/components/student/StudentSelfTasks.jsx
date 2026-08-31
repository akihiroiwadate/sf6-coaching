import {
  useState,
} from "react";

import {
  supabase,
} from "../../lib/supabase";


function StudentSelfTasks({
  studentId,
  tasks,
  onTasksChanged,
}) {
  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    targetCount,
    setTargetCount,
  ] = useState("");

  const [
    dueDate,
    setDueDate,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);


  const activeTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "active"
    );


  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "completed"
    );


  async function handleAddTask(
    event
  ) {
    event.preventDefault();


    const trimmedTitle =
      title.trim();


    if (!trimmedTitle) {
      alert(
        "課題を入力してください"
      );

      return;
    }


    setSaving(true);


    const target =
      targetCount
        ? Number(targetCount)
        : null;


    const {
      error,
    } = await supabase
      .from("student_tasks")
      .insert({
        student_id:
          studentId,

        task_type:
          "self",

        title:
          trimmedTitle,

        description:
          description.trim() ||
          null,

        target_count:
          target,

        current_count:
          0,

        due_date:
          dueDate ||
          null,

        status:
          "active",
      });


    if (error) {
      console.error(
        "課題追加エラー:",
        error
      );

      alert(
        `課題の追加に失敗しました：${error.message}`
      );

      setSaving(false);

      return;
    }


    setTitle("");

    setDescription("");

    setTargetCount("");

    setDueDate("");

    setShowForm(false);

    setSaving(false);


    await onTasksChanged();
  }


  async function changeCount(
    task,
    amount
  ) {
    if (
      task.status !==
      "active"
    ) {
      return;
    }


    if (!task.target_count) {
      return;
    }


    const nextCount =
      Math.max(
        0,
        Math.min(
          task.current_count +
            amount,
          task.target_count
        )
      );


    const {
      error,
    } = await supabase
      .from("student_tasks")
      .update({
        current_count:
          nextCount,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        task.id
      );


    if (error) {
      console.error(
        "進捗更新エラー:",
        error
      );

      alert(
        "進捗の更新に失敗しました"
      );

      return;
    }


    await onTasksChanged();
  }


  async function completeTask(
    task
  ) {
    const confirmed =
      window.confirm(
        `「${task.title}」を達成済みにしますか？`
      );


    if (!confirmed) {
      return;
    }


    const {
      error,
    } = await supabase
      .from("student_tasks")
      .update({
        status:
          "completed",

        current_count:
          task.target_count
            ? task.target_count
            : task.current_count,

        completed_at:
          new Date()
            .toISOString(),

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        task.id
      );


    if (error) {
      console.error(
        "課題達成エラー:",
        error
      );

      alert(
        "課題の更新に失敗しました"
      );

      return;
    }


    await onTasksChanged();
  }


  async function deleteTask(
    task
  ) {
    const confirmed =
      window.confirm(
        `「${task.title}」を削除しますか？`
      );


    if (!confirmed) {
      return;
    }


    const {
      error,
    } = await supabase
      .from("student_tasks")
      .delete()
      .eq(
        "id",
        task.id
      )
      .eq(
        "task_type",
        "self"
      );


    if (error) {
      console.error(
        "課題削除エラー:",
        error
      );

      alert(
        "課題の削除に失敗しました"
      );

      return;
    }


    await onTasksChanged();
  }


  function getProgress(
    task
  ) {
    if (!task.target_count) {
      return 0;
    }


    return Math.min(
      100,
      Math.round(
        (
          task.current_count /
          task.target_count
        ) * 100
      )
    );
  }


  return (
    <section className="content-card">

      <div className="section-title">

        <div>

          <h3>
            自分で決めた課題
          </h3>

          <p>
            自分で取り組みたいことを
            管理できます
          </p>

        </div>


        <button
          type="button"
          className="primary-button"
          onClick={() =>
            setShowForm(
              !showForm
            )
          }
        >
          ＋ 課題を追加
        </button>

      </div>


      {showForm && (

        <form
          className="student-task-form"
          onSubmit={
            handleAddTask
          }
        >

          <div className="form-group">

            <label>
              課題
            </label>

            <input
              type="text"
              value={
                title
              }
              onChange={
                (event) =>
                  setTitle(
                    event.target.value
                  )
              }
              placeholder="例：対空を安定させる"
              maxLength="100"
            />

          </div>


          <div className="form-group">

            <label>
              メモ
            </label>

            <textarea
              value={
                description
              }
              onChange={
                (event) =>
                  setDescription(
                    event.target.value
                  )
              }
              rows="3"
              placeholder="例：ランクマッチで対空を意識する"
            />

          </div>


          <div className="student-task-form-grid">

            <div className="form-group">

              <label>
                目標回数
              </label>

              <input
                type="number"
                min="1"
                value={
                  targetCount
                }
                onChange={
                  (event) =>
                    setTargetCount(
                      event.target.value
                    )
                }
                placeholder="任意"
              />

            </div>


            <div className="form-group">

              <label>
                期限
              </label>

              <input
                type="date"
                value={
                  dueDate
                }
                onChange={
                  (event) =>
                    setDueDate(
                      event.target.value
                    )
                }
              />

            </div>

          </div>


          <div className="student-task-form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                setShowForm(
                  false
                )
              }
            >
              キャンセル
            </button>


            <button
              type="submit"
              className="primary-button"
              disabled={
                saving
              }
            >
              {saving
                ? "追加中..."
                : "追加する"}
            </button>

          </div>

        </form>

      )}


      <div className="student-task-section">

        <h4>
          現在の課題
        </h4>


        {activeTasks.length ===
        0 ? (

          <p className="student-task-empty">
            現在取り組んでいる課題はありません
          </p>

        ) : (

          <div className="student-task-list">

            {activeTasks.map(
              (task) => {

                const progress =
                  getProgress(
                    task
                  );


                return (
                  <article
                    className="student-task-card"
                    key={
                      task.id
                    }
                  >

                    <div className="student-task-card-header">

                      <div>

                        <strong>
                          {task.title}
                        </strong>


                        {task.description && (

                          <p>
                            {task.description}
                          </p>

                        )}

                      </div>


                      <button
                        type="button"
                        className="student-task-delete"
                        onClick={() =>
                          deleteTask(
                            task
                          )
                        }
                      >
                        削除
                      </button>

                    </div>


                    {task.due_date && (

                      <div className="student-task-due-date">
                        期限：
                        {task.due_date}
                      </div>

                    )}


                    {task.target_count && (

                      <div className="student-task-progress-area">

                        <div className="student-task-progress-label">

                          <span>
                            進捗
                          </span>

                          <strong>
                            {task.current_count}
                            {" / "}
                            {task.target_count}
                          </strong>

                        </div>


                        <div className="student-task-progress">

                          <div
                            className="student-task-progress-bar"
                            style={{
                              width:
                                `${progress}%`,
                            }}
                          />

                        </div>


                        <div className="student-task-count-actions">

                          <button
                            type="button"
                            onClick={() =>
                              changeCount(
                                task,
                                -1
                              )
                            }
                            disabled={
                              task.current_count <=
                              0
                            }
                          >
                            −
                          </button>


                          <strong>
                            {task.current_count}
                            回
                          </strong>


                          <button
                            type="button"
                            onClick={() =>
                              changeCount(
                                task,
                                1
                              )
                            }
                            disabled={
                              task.current_count >=
                              task.target_count
                            }
                          >
                            ＋
                          </button>

                        </div>

                      </div>

                    )}


                    <div className="student-task-card-actions">

                      <button
                        type="button"
                        className="student-task-complete-button"
                        onClick={() =>
                          completeTask(
                            task
                          )
                        }
                      >
                        ✓ 達成する
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </div>


      {completedTasks.length >
        0 && (

        <div className="student-task-section completed">

          <h4>
            達成した課題
          </h4>


          <div className="student-completed-task-list">

            {completedTasks.map(
              (task) => (

                <div
                  className="student-completed-task"
                  key={
                    task.id
                  }
                >

                  <span className="student-completed-check">
                    ✓
                  </span>


                  <div>

                    <strong>
                      {task.title}
                    </strong>


                    {task.completed_at && (

                      <span>
                        {new Date(
                          task.completed_at
                        )
                          .toLocaleDateString(
                            "ja-JP"
                          )}
                        達成
                      </span>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </section>
  );
}


export default StudentSelfTasks;