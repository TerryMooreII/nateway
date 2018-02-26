const strMapToObj = (strMap) => {
  const obj = Object.create(null);
  for (const [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
};


module.exports = {
  strMapToObj
};
