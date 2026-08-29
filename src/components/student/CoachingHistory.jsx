function CoachingHistory({
  coachingRecords,
}) {
  return (
    <section className="content-card">

      <div className="section-title">

        <h3>
          これまでのコーチング
        </h3>

        <span>
          {
            coachingRecords.length
          }
          回
        </span>

      </div>


      {coachingRecords.length ===
      0 ? (

        <p>
          まだコーチング記録がありません。
        </p>

      ) : (

        <div className="coaching-history">

          {coachingRecords.map(
            (record) => (

              <div
                className="coaching-record"
                key={
                  record.id
                }
              >

                <div className="coaching-record-header">

                  <div>

                    <strong>
                      {record.date}
                    </strong>


                    <span>
                      {record.coach ||
                        ""}
                    </span>


                    {record.mr !== null &&
                      record.mr !==
                        undefined && (
                      <span>
                        MR {record.mr}
                      </span>
                    )}

                  </div>

                </div>


                <div className="coaching-record-content">

                  <div>

                    <h4>
                      今回の内容
                    </h4>

                    <p>
                      {record.match_content ||
                        "-"}
                    </p>

                  </div>


                  <div>

                    <h4>
                      良かったところ
                    </h4>

                    <p>
                      {record.good_points ||
                        "-"}
                    </p>

                  </div>


                  <div>

                    <h4>
                      改善ポイント
                    </h4>

                    <p>
                      {record.improvement_points ||
                        "-"}
                    </p>

                  </div>


                  <div>

                    <h4>
                      次回までの課題
                    </h4>

                    <p>
                      {record.next_task ||
                        "-"}
                    </p>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </section>
  );
}


export default CoachingHistory;