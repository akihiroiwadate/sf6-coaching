import MrChart from "./MrChart";


function StudentGrowthSummary({
  student,
  coachingRecords,
}) {
  const mrRecords =
    coachingRecords.filter(
      (record) =>
        record.mr !== null &&
        record.mr !== undefined
    );


  const latestMr =
    student.mr ??
    mrRecords[0]?.mr ??
    "-";


  const oldestMr =
    mrRecords.length > 0
      ? mrRecords[
          mrRecords.length - 1
        ].mr
      : null;


  const mrDifference =
    oldestMr !== null &&
    latestMr !== "-"
      ? Number(latestMr) -
        Number(oldestMr)
      : null;


  return (
    <section className="content-card">

      <div className="section-title">

        <div>
          <h3>
            成長サマリー
          </h3>

          <p>
            MRの変化から
            成長を確認できます
          </p>
        </div>

      </div>


      <div className="growth-summary">

        <div className="growth-card">

          <span>
            現在のランク
          </span>

          <strong>
            {student.rank ||
              "-"}
          </strong>

        </div>


        <div className="growth-card">

          <span>
            現在のMR
          </span>

          <strong>
            {latestMr}
          </strong>


          {mrDifference !== null && (
            <small>
              {mrDifference > 0
                ? `+${mrDifference}`
                : mrDifference}
            </small>
          )}

        </div>


        <div className="growth-card">

          <span>
            コーチング回数
          </span>

          <strong>
            {
              coachingRecords.length
            }
          </strong>

          <small>
            回
          </small>

        </div>

      </div>


      <div
        style={{
          marginTop:
            "32px",
        }}
      >

        <div className="section-title">

          <div>
            <h3>
              MR推移
            </h3>

            <p>
              コーチング実施時の
              MRを表示しています
            </p>
          </div>


          {mrRecords.length > 0 && (
            <span>
              {
                mrRecords.length
              }
              件の記録
            </span>
          )}

        </div>


        <MrChart
          records={
            coachingRecords
          }
        />

      </div>

    </section>
  );
}


export default StudentGrowthSummary;