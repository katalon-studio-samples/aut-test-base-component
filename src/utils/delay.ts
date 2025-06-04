export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const simulateNetworkDelay = async (
  minDelay = 1000,
  maxDelay = 3000,
) => {
  const delayTime = Math.random() * (maxDelay - minDelay) + minDelay;
  await delay(delayTime);
};
