import { format } from "date-fns";

export function formatDateDisplay(date: Date | undefined): string {
  if (!date) return "Select date";
  return format(date, "EEEE, MMM d");
}

export function formatTimeDisplay(time: Date): string {
  return format(time, "h a");
}

export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatEventDateTime(
  date: Date,
  time: Date,
  isAllDay: boolean
): string {
  const dateStr = format(date, "yyyy-MM-dd");
  if (isAllDay) {
    return `${dateStr}T00:00:00`;
  }
  const timeStr = format(time, "HH:mm");
  return `${dateStr}T${timeStr}:00`;
}

export function createDateTime(date: Date, time: Date): Date {
  const result = new Date(date);
  result.setHours(time.getHours());
  result.setMinutes(time.getMinutes());
  result.setSeconds(0);
  result.setMilliseconds(0);
  return result;
}

export function adjustEndTimeIfNeeded(
  startDate: Date,
  endDate: Date,
  startTime: Date,
  endTime: Date
): Date {
  const startDateTime = createDateTime(startDate, startTime);
  const endDateTime = createDateTime(endDate, endTime);

  if (endDateTime <= startDateTime) {
    const newEndTime = new Date(startTime);
    newEndTime.setHours(newEndTime.getHours() + 1);
    return newEndTime;
  }

  return endTime;
}

export function isAllDayEvent(from: string, to: string): boolean {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const fromTimeStr = format(fromDate, "HH:mm");
  const toTimeStr = format(toDate, "HH:mm");
  return fromTimeStr === "00:00" && toTimeStr === "23:59";
}
