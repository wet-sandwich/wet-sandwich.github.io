// create ISO duration string for use within <time> elements
export function formatISOduration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const h = hours > 0 ? `${hours}H` : "";
  const m = minutes > 0 || hours === 0 ? `${minutes}M` : "";

  return `PT${h}${m}`;
}

// make a human readable string in the format of HH:MM
export function formatReadable(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const m = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${hours}h ${m}m`;
}

// get a timestamp in the form of "dd mmm yyyy HH:MM AM/PM" from a unix timestamp in seconds
export function formatTimestamp(seconds: number) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone,
    })
      .formatToParts(new Date(seconds * 1000))
      .map((p) => [p.type, p.value])
  );

  return `${parts.day} ${parts.month} ${parts.year} ${parts.hour}:${parts.minute} ${parts.dayPeriod}`;
}
