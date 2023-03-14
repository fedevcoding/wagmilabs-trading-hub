export async function clientCache(
  name, // string,
  ttl, // number,
  value, // Promise | string | number
  force = false // boolean
) {
  const currentTime = Date.now() / 1000;

  if (!force) {
    try {
      const itemString = localStorage.getItem(name);
      if (itemString) {
        const item = JSON.parse(itemString);
        if (item.data && item.time && item.time + ttl > currentTime) {
          return item.data;
        }
      }
    } catch (error) {
      // wrong data
    }
  }

  console.log("value", value);
  let data = value;
  if (typeof value === "function") {
    data = value();
    if (typeof data === "object" && typeof data.then === "function") {
      // promise
      data = await data;
    }
  }

  localStorage.setItem(
    name,
    JSON.stringify({
      data,
      time: Math.floor(currentTime),
    })
  );

  return data;
}
