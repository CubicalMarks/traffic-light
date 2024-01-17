// Sleep
// @param ms = Milliseconds to sleep
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

