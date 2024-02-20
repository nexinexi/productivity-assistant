export const pluralize = (word: string, count: number) => {
  const postFix = count > 1 ? 's' : '';

  return word + postFix;
};
