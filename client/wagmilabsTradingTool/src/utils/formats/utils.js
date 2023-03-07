function getPercentage(num1, num2) {
  return Math.round((num1 / num2) * 100);
}

function generateRandomRangeInt(min, max, excluded) {
  let random =  Math.floor(Math.random() * (max - min + 1) + min);
  if (excluded && excluded === random) {
    return generateRandomRangeInt(min, max, excluded);
  }
  return random;
}

function chunkArrayInGroups (arr, size) {
  let myArray = [];
  for(let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }
  return myArray;
}

module.exports = {
  getPercentage,
  generateRandomRangeInt,
  chunkArrayInGroups,
};
