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

  return `${hours}:${m}`;
}
