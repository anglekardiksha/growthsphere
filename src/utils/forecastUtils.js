/**
 * Simple ordinary-least-squares linear regression forecast.
 * Fits a line to the last N data points of a metric and projects
 * it forward by `daysAhead` days. Good enough to demonstrate a
 * real predictive layer on top of the dashboard without pulling
 * in a heavy ML library for a client-side React app.
 */

export function linearRegressionForecast(data, key, daysAhead = 7) {
  const n = data.length;
  if (n < 2) return [];

  const xs = data.map((_, i) => i);
  const ys = data.map((d) => Number(d[key]) || 0);

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((sum, x, i) => sum + x * ys[i], 0);
  const sumXX = xs.reduce((sum, x) => sum + x * x, 0);

  const denominator = n * sumXX - sumX * sumX;
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // R² tells you (and interviewers) how much to trust the trend line
  const meanY = sumY / n;
  const ssTot = ys.reduce((sum, y) => sum + (y - meanY) ** 2, 0);
  const ssRes = ys.reduce((sum, y, i) => sum + (y - (slope * xs[i] + intercept)) ** 2, 0);
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  const lastDate = new Date(data[n - 1].date);
  const forecastPoints = [];

  for (let i = 1; i <= daysAhead; i++) {
    const x = n - 1 + i;
    const predicted = Math.max(0, slope * x + intercept);
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);

    forecastPoints.push({
      date: forecastDate.toISOString().split("T")[0],
      forecast: Math.round(predicted),
    });
  }

  return { forecastPoints, slope, rSquared: Math.round(rSquared * 100) / 100 };
}

/**
 * Merges actual chart data with forecast points into one array
 * that Recharts can plot as two lines on the same axis.
 */
export function buildForecastSeries(actualData, key, daysAhead = 7) {
  const { forecastPoints, rSquared } = linearRegressionForecast(actualData, key, daysAhead);

  const actualWithNullForecast = actualData.map((d) => ({
    ...d,
    forecast: null,
  }));

  // bridge point so the dashed forecast line connects to the solid actual line
  if (actualWithNullForecast.length) {
    actualWithNullForecast[actualWithNullForecast.length - 1].forecast =
      actualWithNullForecast[actualWithNullForecast.length - 1][key];
  }

  return {
    series: [...actualWithNullForecast, ...forecastPoints],
    rSquared,
  };
}