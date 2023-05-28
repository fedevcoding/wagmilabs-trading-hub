export const getDaysInMonth = (month, year, changedDate, today) => {
  var date = new Date(year, month, 1);
  var previousDate = new Date(year, date.getMonth() - 1, 1);
  var nextDate = new Date(year, date.getMonth() + 1, 1);
  var days = [];
  var previousDays = [];
  var nextDays = [];
  while (date.getMonth() === month) {
    const isSelected =
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear() &&
      date.getDate() === today.getDate();
    isSelected
      ? days.push({ date: new Date(date), isSelected: !changedDate })
      : days.push({ date: new Date(date) });
    date.setDate(date.getDate() + 1);
  }
  while (previousDate.getMonth() === month - 1) {
    previousDays.push({ date: new Date(previousDate), notCurrent: true });
    previousDate.setDate(previousDate.getDate() + 1);
  }
  while (nextDate.getMonth() === month + 1) {
    nextDays.push({ date: new Date(nextDate), notCurrent: true });
    nextDate.setDate(nextDate.getDate() + 1);
  }
  /* add days of previous month if needed */
  if (days[0].date.getDay() !== 0) {
    const temp = previousDays.slice(
      previousDays.length - 6,
      previousDays.length
    );
    const firstDayIndex = temp.findIndex(el => el.date.getDay() === 0);
    const firstDays = temp.slice(firstDayIndex);
    days.unshift(...firstDays);
  }
  /* add days of next month if needed */
  if (days[days.length - 1].date.getDay() !== 6) {
    const temp = nextDays.slice(0, 7);
    const lastDayIndex = temp.findIndex(el => el.date.getDay() === 6);
    const lastDays = temp.slice(0, lastDayIndex + 1);
    days.push(...lastDays);
  }

  return days;
};