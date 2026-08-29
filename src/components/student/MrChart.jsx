function formatChartDate(
  date
) {
  if (!date) {
    return "";
  }


  const dateObject =
    new Date(
      `${date}T00:00:00`
    );


  if (
    Number.isNaN(
      dateObject.getTime()
    )
  ) {
    return date;
  }


  return `${
    dateObject.getMonth() + 1
  }/${dateObject.getDate()}`;
}


function MrChart({
  records,
}) {
  const mrRecords =
    records
      .filter(
        (record) =>
          record.mr !== null &&
          record.mr !== undefined &&
          record.date
      )
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );


  if (
    mrRecords.length === 0
  ) {
    return (
      <div
        style={{
          padding:
            "40px 20px",
          textAlign:
            "center",
          border:
            "1px dashed #d4d4d8",
          borderRadius:
            "10px",
          color:
            "#71717a",
        }}
      >
        まだMRの記録がありません
      </div>
    );
  }


  if (
    mrRecords.length === 1
  ) {
    return (
      <div
        style={{
          padding:
            "40px 20px",
          textAlign:
            "center",
          border:
            "1px solid #e4e4e7",
          borderRadius:
            "10px",
          background:
            "#fafafa",
        }}
      >

        <div
          style={{
            color:
              "#71717a",
            marginBottom:
              "8px",
          }}
        >
          最初のMR記録
        </div>


        <strong
          style={{
            fontSize:
              "36px",
          }}
        >
          {
            mrRecords[0].mr
          }
        </strong>


        <div
          style={{
            marginTop:
              "8px",
            color:
              "#71717a",
            fontSize:
              "13px",
          }}
        >
          {formatChartDate(
            mrRecords[0].date
          )}
        </div>


        <p
          style={{
            marginTop:
              "18px",
            color:
              "#71717a",
            fontSize:
              "13px",
          }}
        >
          MRが2回以上記録されると
          推移グラフが表示されます
        </p>

      </div>
    );
  }


  const width =
    800;

  const height =
    320;


  const padding = {
    top: 30,
    right: 30,
    bottom: 55,
    left: 65,
  };


  const values =
    mrRecords.map(
      (record) =>
        Number(
          record.mr
        )
    );


  const actualMin =
    Math.min(
      ...values
    );

  const actualMax =
    Math.max(
      ...values
    );


  const range =
    Math.max(
      actualMax -
        actualMin,
      100
    );


  const margin =
    Math.max(
      Math.ceil(
        range * 0.2
      ),
      50
    );


  const minMr =
    Math.floor(
      (actualMin -
        margin) /
        50
    ) * 50;


  const maxMr =
    Math.ceil(
      (actualMax +
        margin) /
        50
    ) * 50;


  const chartWidth =
    width -
    padding.left -
    padding.right;


  const chartHeight =
    height -
    padding.top -
    padding.bottom;


  function getX(
    index
  ) {
    return (
      padding.left +
      (
        index /
        (
          mrRecords.length -
          1
        )
      ) *
      chartWidth
    );
  }


  function getY(
    value
  ) {
    return (
      padding.top +
      (
        (
          maxMr -
          value
        ) /
        (
          maxMr -
          minMr
        )
      ) *
      chartHeight
    );
  }


  const points =
    mrRecords
      .map(
        (
          record,
          index
        ) =>
          `${getX(index)},${getY(
            Number(
              record.mr
            )
          )}`
      )
      .join(" ");


  const gridCount =
    4;


  const gridValues =
    Array.from(
      {
        length:
          gridCount + 1,
      },
      (_, index) =>
        Math.round(
          maxMr -
          (
            (
              maxMr -
              minMr
            ) /
            gridCount
          ) *
          index
        )
    );


  return (
    <div
      style={{
        width:
          "100%",
        overflowX:
          "auto",
      }}
    >

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width:
            "100%",
          minWidth:
            "600px",
          display:
            "block",
        }}
        role="img"
        aria-label="MR推移グラフ"
      >

        {gridValues.map(
          (
            value,
            index
          ) => {
            const y =
              padding.top +
              (
                index /
                gridCount
              ) *
              chartHeight;


            return (
              <g
                key={
                  `${value}-${index}`
                }
              >

                <line
                  x1={
                    padding.left
                  }
                  x2={
                    width -
                    padding.right
                  }
                  y1={y}
                  y2={y}
                  stroke="#e4e4e7"
                  strokeWidth="1"
                />


                <text
                  x={
                    padding.left -
                    12
                  }
                  y={
                    y + 5
                  }
                  textAnchor="end"
                  fontSize="12"
                  fill="#71717a"
                >
                  {value}
                </text>

              </g>
            );
          }
        )}


        <polyline
          points={
            points
          }
          fill="none"
          stroke="#18181b"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />


        {mrRecords.map(
          (
            record,
            index
          ) => {
            const x =
              getX(
                index
              );

            const y =
              getY(
                Number(
                  record.mr
                )
              );


            return (
              <g
                key={
                  record.id
                }
              >

                <circle
                  cx={x}
                  cy={y}
                  r="7"
                  fill="#ffffff"
                  stroke="#18181b"
                  strokeWidth="4"
                />


                <text
                  x={x}
                  y={
                    y - 16
                  }
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill="#18181b"
                >
                  {
                    record.mr
                  }
                </text>


                <text
                  x={x}
                  y={
                    height - 20
                  }
                  textAnchor="middle"
                  fontSize="12"
                  fill="#71717a"
                >
                  {formatChartDate(
                    record.date
                  )}
                </text>

              </g>
            );
          }
        )}

      </svg>

    </div>
  );
}


export default MrChart;