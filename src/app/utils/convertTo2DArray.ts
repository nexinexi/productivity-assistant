export const convertTo2DArray = (array: never[], size = 2): never[][] => {
  const result: never[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};
