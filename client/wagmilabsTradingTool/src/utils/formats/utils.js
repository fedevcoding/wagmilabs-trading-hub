function getPercentage(num1, num2) {
  return Math.round((num1 / num2) * 100);
}

function generateRandomRangeInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  getPercentage,
  generateRandomRangeInt,
};
