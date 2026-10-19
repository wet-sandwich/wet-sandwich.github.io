import { format } from "date-fns";

// create ISO duration string for use within <time> elements
export function formatISOduration(ms: number): string {
  const seconds = Math.round(ms / 1000);
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const h = hours > 0 ? `${hours}H` : "";
  const m = minutes > 0 || hours === 0 ? `${minutes}M` : "";

  return `PT${h}${m}`;
}

// make a human readable string in the format of HH:MM
export function formatReadable(ms: number): string {
  const seconds = Math.round(ms / 1000);
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const m = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${hours}h ${m}m`;
}

// get a timestamp in the form of "Jan 01, 1970 24:00" from a timestamp in milliseconds
export function formatTimestamp(ms: number) {
  if (isNaN(ms)) return "";
  return format(new Date(ms), "MMM dd, y kk:mm");
}
