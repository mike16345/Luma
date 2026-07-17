function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatLocalDateTimeInput(date = new Date()) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseLocalDateTimeInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(
    value.trim()
  );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null;
  }

  return date;
}

export function formatLocalTimeInput(date = new Date()) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function dateFromLocalTimeInput(value: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}
