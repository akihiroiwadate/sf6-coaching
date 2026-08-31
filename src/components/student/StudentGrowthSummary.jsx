function formatGraphDate(
  value
) {
  if (!value) {
    return "";
  }


  const date =
    new Date(
      `${value}T00:00:00`
    );


  return `${date.getMonth() + 1}/${date.getDate()}`;
}


function StudentGrowthSummary({
  student,
  coachingRecords = [],
}) {
  /*
   * coaching_records は
   * StudentMyPage側では新しい順なので、
   * グラフでは古い → 新しい順に並べる
   */
  const mrRecords =
    coachingRecords
      .filter(
        (record) =>
          record.mr !==
            null &&
          record.mr !==
            undefined &&
          record.mr !==
            "" &&
          !Number.isNaN(
            Number(
              record.mr
            )
          )
      )
      .map(
        (record) => ({
          ...record,
          mr: Number(
            record.mr
          ),
        })
      )
      .sort(
        (a, b) =>
          new Date(
            a.date
          ) -
          new Date(
            b.date
          )
      );


  /*
   * 現在MR
   *
   * students.mr があればそれを優先
   * 無ければ最新のコーチング記録を使用
   */
  const latestRecord =
    mrRecords.length > 0
      ? mrRecords[
          mrRecords.length - 1
        ]
      : null;


  const currentMr =
    student.mr !== null &&
    student.mr !== undefined &&
    student.mr !== ""
      ? Number(
          student.mr
        )
      : latestRecord
        ? latestRecord.mr
        : null;


  return (
    <section className="content-card">

      <div className="section-title">

        <h3>
          成長サマリー
        </h3>

      </div>


      <div className="growth-summary">

        <div className="growth-card">

          <span>
            現在のMR
          </span>

          <strong>
            {currentMr ??
              "-"}
          </strong>

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


        <div className="growth-card">

          <span>
            現在のランク
          </span>

          <strong>
            {student.rank ||
              "-"}
          </strong>

        </div>

      </div>


      <div className="mr-growth-section">

        <div className="mr-growth-header">

          <div>

            <h4>
              MR推移
            </h4>

            <p>
              コーチング時に記録した
              MRの変化
            </p>

          </div>


          <span className="mr-growth-count">

            {mrRecords.length}
            件

          </span>

        </div>


        {mrRecords.length ===
        0 ? (

          <div className="mr-growth-empty">

            <p>
              MRの記録がまだありません
            </p>

            <span>
              コーチング記録にMRを登録すると、
              ここに推移が表示されます
            </span>

          </div>

        ) : (

          <MrLineChart
            records={
              mrRecords
            }
          />

        )}

      </div>

    </section>
  );
}


function MrLineChart({
  records,
}) {
  const width =
    1000;

  const height =
    280;


  const padding = {
    top: 30,
    right: 30,
    bottom: 55,
    left: 70,
  };


  const graphWidth =
    width -
    padding.left -
    padding.right;


  const graphHeight =
    height -
    padding.top -
    padding.bottom;


  const mrValues =
    records.map(
      (record) =>
        record.mr
    );


  const actualMinMr =
    Math.min(
      ...mrValues
    );


  const actualMaxMr =
    Math.max(
      ...mrValues
    );


  /*
   * 上下に少し余白を持たせる
   */
  const mrRange =
    actualMaxMr -
    actualMinMr;


  const margin =
    mrRange > 0
      ? Math.max(
          Math.ceil(
            mrRange * 0.2
          ),
          50
        )
      : 100;


  const minMr =
    Math.max(
      0,
      Math.floor(
        (
          actualMinMr -
          margin
        ) /
          100
      ) * 100
    );


  let maxMr =
    Math.ceil(
      (
        actualMaxMr +
        margin
      ) /
        100
    ) * 100;


  if (
    maxMr ===
    minMr
  ) {
    maxMr =
      minMr +
      200;
  }


  const range =
    maxMr -
    minMr;


  function getX(index) {
    if (
      records.length === 1
    ) {
      return (
        padding.left +
        graphWidth / 2
      );
    }


    return (
      padding.left +
      (
        index /
        (
          records.length -
          1
        )
      ) *
        graphWidth
    );
  }


  function getY(mr) {
    return (
      padding.top +
      (
        1 -
        (
          mr -
          minMr
        ) /
          range
      ) *
        graphHeight
    );
  }


  const points =
    records.map(
      (
        record,
        index
      ) => ({
        x: getX(
          index
        ),
        y: getY(
          record.mr
        ),
        mr: record.mr,
        date: record.date,
      })
    );


  const polylinePoints =
    points
      .map(
        (point) =>
          `${point.x},${point.y}`
      )
      .join(" ");


  const gridCount =
    4;


  const gridLines =
    Array.from(
      {
        length:
          gridCount + 1,
      },
      (
        _,
        index
      ) => {

        const ratio =
          index /
          gridCount;


        const y =
          padding.top +
          ratio *
            graphHeight;


        const value =
          Math.round(
            maxMr -
            ratio *
              range
          );


        return {
          y,
          value,
        };
      }
    );


  return (
    <div className="mr-chart-wrapper">

      <svg
        className="mr-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="MR推移グラフ"
      >

        {/* =====================
            横グリッド
        ===================== */}

        {gridLines.map(
          (
            line,
            index
          ) => (

            <g
              key={
                index
              }
            >

              <line
                x1={
                  padding.left
                }
                y1={
                  line.y
                }
                x2={
                  width -
                  padding.right
                }
                y2={
                  line.y
                }
                className="mr-chart-grid-line"
              />


              <text
                x={
                  padding.left -
                  12
                }
                y={
                  line.y +
                  4
                }
                textAnchor="end"
                className="mr-chart-axis-text"
              >
                {
                  line.value
                }
              </text>

            </g>

          )
        )}


        {/* =====================
            折れ線
        ===================== */}

        {points.length >
          1 && (

          <polyline
            points={
              polylinePoints
            }
            className="mr-chart-line"
          />

        )}


        {/* =====================
            データポイント
        ===================== */}

        {points.map(
          (
            point,
            index
          ) => (

            <g
              key={
                `${point.date}-${index}`
              }
              className="mr-chart-point-group"
            >

              <circle
                cx={
                  point.x
                }
                cy={
                  point.y
                }
                r="6"
                className="mr-chart-point"
              />


              <text
                x={
                  point.x
                }
                y={
                  point.y -
                  14
                }
                textAnchor="middle"
                className="mr-chart-value"
              >
                {
                  point.mr
                }
              </text>


              <text
                x={
                  point.x
                }
                y={
                  height -
                  20
                }
                textAnchor="middle"
                className="mr-chart-date"
              >
                {
                  formatGraphDate(
                    point.date
                  )
                }
              </text>

            </g>

          )
        )}

      </svg>

    </div>
  );
}


export default StudentGrowthSummary;