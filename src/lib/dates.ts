import { DateTime } from 'luxon';

export function formatHumanDate(dateInput: Date | string) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return DateTime.fromJSDate(date).setZone('utc').toFormat('LLLL d, y');
}

export function formatDefaultDate(dateString: string) {
  return DateTime.fromFormat(dateString, 'd/MM/yyyy').toFormat('LLLL d, y');
}
