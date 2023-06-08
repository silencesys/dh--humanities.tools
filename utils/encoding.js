const encodeIds = (resources) => {
  var result = [];
  for (let i = 0; i < resources.length; i++) {
      // Extract the number part from the ID and convert it to base36
      let number = parseInt(resources[i].substring(3));
      let base36 = number.toString(36).toUpperCase();
      result.push(base36);
  }
  return result.join("-");
}

const decodeIds = (encodedString) => {
  const result = [];
  const encodedIds = encodedString.split("-");
  for (let i = 0; i < encodedIds.length; i++) {
      const id = parseInt(encodedIds[i], 36);
      result.push('SO-' + id);
  }
  return result;
}

export {
  encodeIds,
  decodeIds
}