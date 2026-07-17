export function formatEstimatedCount(value: number) {
  if (value < 10) {
    return value.toFixed(1);
  }

  return Math.round(value).toLocaleString();
}

export function buildEstimateLabel(label: string, estimateLabel = "estimate") {
  return `${label} (${estimateLabel})`;
}
