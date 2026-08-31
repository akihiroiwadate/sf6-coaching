import {
  supabase,
} from "../../lib/supabase";


function CoachTasks({
  tasks,
  onTasksChanged,
  onRewardChanged,
}) {
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
      )
      .eq(
        "task_type",
        "coach"
      )
      .eq(
        "status",
        "active"
      );


    if (error) {
      console.error(
        "コーチ課題達成エラー:",
        error
      );

      alert(
        "課題の更新に失敗しました"
      );

      return;
    }


    await onTasksChanged();


    if (onRewardChanged) {
      await onRewardChanged();
    }
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
    <section className="content-card coach-task-section">

      <div className="section-title">

        <div>

          <h3>
            コーチからの課題
          </h3>

          <p>
            コーチから出された
            次回までの課題です
          </p>

        </div>

      </div>


      {activeTasks.length ===
      0 ? (

        <p className="student-task-empty">
          現在のコーチ課題はありません
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
                  className="student-task-card coach-task-card"
                  key={
                    task.id
                  }
                >

                  <div className="student-task-card-header">

                    <div>

                      <span className="coach-task-label">
                        COACH TASK
                      </span>

                      <strong>
                        {task.title}
                      </strong>


                      {task.description && (

                        <p>
                          {task.description}
                        </p>

                      )}

                    </div>


                    <span className="coach-task-reward">
                      +50pt
                    </span>

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


      {completedTasks.length >
        0 && (

        <div className="student-task-section completed">

          <h4>
            達成したコーチ課題
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

                    <span>
                      +50pt
                    </span>

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


export default CoachTasks;