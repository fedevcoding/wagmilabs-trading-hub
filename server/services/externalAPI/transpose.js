const execTranseposeAPI = async (sql) => {
  let result = await fetch("https://api.transpose.io/sql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.TRANSPOSE_API,
    },
    body: JSON.stringify({
      sql,
    }),
  });

  result = await result.json();

  return result.results;
};

module.exports = {
  execTranseposeAPI,
};
