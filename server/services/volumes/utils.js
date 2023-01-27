const groupByWeek = (data, elements) => {
  const weeks = data.reduce((acc, curr) => {
    const date = new Date(curr.ts);
    const weekStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay()
    );

    const weekStartStr = weekStart.toISOString().split("T")[0];
    if (!acc[weekStartStr]) {
      acc[weekStartStr] = {
        ts: weekStartStr,
      };
      for (const elem of elements) {
        acc[weekStartStr][elem] = 0;
      }
    }
    for (const elem of elements) {
      acc[weekStartStr][elem] += curr[elem];
    }
    return acc;
  }, {});

  return Object.values(weeks);
};

const groupBy2Weeks = (data, elements) => {
  const weeks = data.reduce((acc, curr) => {
    const date = new Date(curr.ts);
    const weekStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay()
    );
    const weekStartStr = weekStart.toISOString().split("T")[0];
    const period = parseInt(date.getTime() / (2 * 7 * 24 * 60 * 60 * 1000));

    if (!acc[period]) {
      acc[period] = {
        ts: weekStartStr,
      };
      for (const elem of elements) {
        acc[period][elem] = 0;
      }
    }
    for (const elem of elements) {
      acc[period][elem] += curr[elem];
    }
    return acc;
  }, {});

  return Object.values(weeks);
};

const groupByMonth = (data, elements) => {
  const weeks = data.reduce((acc, curr) => {
    const date = new Date(curr.ts);
    const month = date.getMonth();
    const year = date.getFullYear();
    const period = month + "-" + year;
    if (!acc[period]) {
      acc[period] = {
        ts: curr.ts,
      };
      for (const elem of elements) {
        acc[period][elem] = 0;
      }
    }
    for (const elem of elements) {
      acc[period][elem] += curr[elem];
    }
    return acc;
  }, {});

  return Object.values(weeks);
};

module.exports = {
  groupByWeek,
  groupBy2Weeks,
  groupByMonth,
};
