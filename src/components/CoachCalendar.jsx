import {
  useMemo,
  useState,
} from "react";

import "../styles/calendar.css";


const WEEK_LABELS = [
  "日",
  "月",
  "火",
  "水",
  "木",
  "金",
  "土",
];


function formatDateValue(
  year,
  month,
  day
) {
  return [
    year,
    String(
      month + 1
    ).padStart(2, "0"),
    String(day).padStart(
      2,
      "0"
    ),
  ].join("-");
}


function CoachCalendar({
  value,
  onChange,
  disabledDates = [],
  minDate = "",
}) {
  const initialDate =
    value
      ? new Date(
          `${value}T00:00:00`
        )
      : new Date();


  const [
    displayYear,
    setDisplayYear,
  ] = useState(
    initialDate.getFullYear()
  );

  const [
    displayMonth,
    setDisplayMonth,
  ] = useState(
    initialDate.getMonth()
  );


  const disabledDateSet =
    useMemo(
      () =>
        new Set(
          disabledDates
        ),
      [
        disabledDates,
      ]
    );


  const calendarDays =
    useMemo(() => {
      const firstDay =
        new Date(
          displayYear,
          displayMonth,
          1
        );

      const lastDay =
        new Date(
          displayYear,
          displayMonth + 1,
          0
        );

      const emptyCount =
        firstDay.getDay();

      const totalDays =
        lastDay.getDate();

      const days = [];


      for (
        let i = 0;
        i < emptyCount;
        i += 1
      ) {
        days.push(null);
      }


      for (
        let day = 1;
        day <= totalDays;
        day += 1
      ) {
        days.push(day);
      }


      return days;
    }, [
      displayYear,
      displayMonth,
    ]);


  function previousMonth() {
    if (
      displayMonth === 0
    ) {
      setDisplayYear(
        (year) =>
          year - 1
      );

      setDisplayMonth(11);

      return;
    }

    setDisplayMonth(
      (month) =>
        month - 1
    );
  }


  function nextMonth() {
    if (
      displayMonth === 11
    ) {
      setDisplayYear(
        (year) =>
          year + 1
      );

      setDisplayMonth(0);

      return;
    }

    setDisplayMonth(
      (month) =>
        month + 1
    );
  }


  function isPastDate(
    dateValue
  ) {
    if (!minDate) {
      return false;
    }

    return (
      dateValue < minDate
    );
  }


  return (
    <div className="coach-calendar">

      <div className="coach-calendar-header">

        <button
          type="button"
          className="calendar-nav-button"
          onClick={
            previousMonth
          }
        >
          ‹
        </button>


        <strong>
          {displayYear}年
          {displayMonth + 1}月
        </strong>


        <button
          type="button"
          className="calendar-nav-button"
          onClick={
            nextMonth
          }
        >
          ›
        </button>

      </div>


      <div className="calendar-week-row">

        {WEEK_LABELS.map(
          (label) => (
            <div
              key={label}
              className="calendar-week-label"
            >
              {label}
            </div>
          )
        )}

      </div>


      <div className="calendar-days-grid">

        {calendarDays.map(
          (
            day,
            index
          ) => {
            if (!day) {
              return (
                <div
                  key={
                    `empty-${index}`
                  }
                  className="calendar-empty"
                />
              );
            }


            const dateValue =
              formatDateValue(
                displayYear,
                displayMonth,
                day
              );


            const scheduleDisabled =
              disabledDateSet.has(
                dateValue
              );

            const pastDisabled =
              isPastDate(
                dateValue
              );

            const disabled =
              scheduleDisabled ||
              pastDisabled;

            const selected =
              value ===
              dateValue;


            return (
              <button
                key={
                  dateValue
                }
                type="button"
                className={
                  `calendar-day ${
                    selected
                      ? "selected"
                      : ""
                  } ${
                    disabled
                      ? "disabled"
                      : ""
                  }`
                }
                disabled={
                  disabled
                }
                onClick={() =>
                  onChange(
                    dateValue
                  )
                }
              >

                <span>
                  {day}
                </span>


                {scheduleDisabled && (
                  <small>
                    ×
                  </small>
                )}

              </button>
            );
          }
        )}

      </div>


      <div className="calendar-legend">

        <span>
          <i className="calendar-legend-available" />
          選択可能
        </span>

        <span>
          <i className="calendar-legend-disabled" />
          対応不可
        </span>

      </div>

    </div>
  );
}


export default CoachCalendar;