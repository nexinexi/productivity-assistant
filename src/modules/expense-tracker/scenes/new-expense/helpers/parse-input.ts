export const parseInput = (input: string) => {
  const parts = input.split(' ');
  const amount = parts.pop();

  return {
    title: parts.join(' ').trim(),
    amount: Number(amount),
  };
};
