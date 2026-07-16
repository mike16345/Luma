const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export function formatDurationCompact(durationMs: number) {
  const days = Math.floor(durationMs / MS_PER_DAY);
  const hours = Math.floor((durationMs % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((durationMs % MS_PER_HOUR) / MS_PER_MINUTE);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

export function formatDurationLong(durationMs: number) {
  const days = Math.floor(durationMs / MS_PER_DAY);
  const hours = Math.floor((durationMs % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((durationMs % MS_PER_HOUR) / MS_PER_MINUTE);

  const parts = [
    days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : null,
    hours > 0 ? `${hours} ${hours === 1 ? "hour" : "hours"}` : null,
    days === 0 && minutes > 0
      ? `${minutes} ${minutes === 1 ? "minute" : "minutes"}`
      : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "0 minutes";
}
