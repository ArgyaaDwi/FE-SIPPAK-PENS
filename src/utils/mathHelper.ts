export type NumericArray = number[];

/**
 * Hitung Mean (Rata-rata)
 */
export const calculateMean = (arr: NumericArray): number => {
  if (!arr || arr.length === 0) return 0;

  const valid = arr.filter((v) => Number.isFinite(v));
  if (valid.length === 0) return 0;

  return valid.reduce((sum, val) => sum + val, 0) / valid.length;
};

/**
 * Hitung Standard Deviation (Sample, N-1)
 */
export const calculateStd = (arr: NumericArray): number => {
  if (!arr || arr.length < 2) return 0;

  const valid = arr.filter((v) => Number.isFinite(v));
  if (valid.length < 2) return 0;

  const mean = calculateMean(valid);

  const variance =
    valid.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    (valid.length - 1);

  return Math.sqrt(variance);
};

/**
 * Hitung Trend (Slope Linear Regression)
 * X = index array (0,1,2,...)
 */
export const calculateTrend = (yArr: NumericArray): number => {
  if (!yArr || yArr.length < 2) return 0;

  const valid = yArr.filter((v) => Number.isFinite(v));
  const n = valid.length;

  if (n < 2) return 0;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += valid[i];
    sumXY += i * valid[i];
    sumXX += i * i;
  }

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return 0;

  return (n * sumXY - sumX * sumY) / denominator;
};
