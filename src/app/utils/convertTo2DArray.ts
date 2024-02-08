export const convertTo2DArray = (array: any[], size = 2): any[][] => {
  const result: any[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};
