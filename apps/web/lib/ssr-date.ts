export function parseIsoDateAtUtc(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1));
}

export function formatMonthDayAtUtc(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parseIsoDateAtUtc(dateStr));
}

export function getUtcWeekday(dateStr: string): number {
  return parseIsoDateAtUtc(dateStr).getUTCDay();
}

export function formatClockAtUtc(isoDateTime: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(isoDateTime));
}
