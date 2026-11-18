export const NIGHT_START = 18; // 6 pm -> dark
export const DAY_START = 6; // 6 am -> light

/** True from 6 pm until 6 am, using the visitor's local time. */
export function isNightNow(now = new Date()) {
  const h = now.getHours();
  return h >= NIGHT_START || h < DAY_START;
}