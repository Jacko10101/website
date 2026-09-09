/** Local CLS estimate using the maximum session window (web.dev/articles/cls). */
export function createLayoutShiftAccumulator() {
  let start = -Infinity;
  let previous = -Infinity;
  let windowScore = 0;
  let maximum = 0;
  return (entry: { startTime: number; value: number; hadRecentInput: boolean }) => {
    if (entry.hadRecentInput) return maximum;
    if (entry.startTime - previous < 1000 && entry.startTime - start < 5000) windowScore += entry.value;
    else { start = entry.startTime; windowScore = entry.value; }
    previous = entry.startTime;
    maximum = Math.max(maximum,windowScore);
    return maximum;
  };
}
