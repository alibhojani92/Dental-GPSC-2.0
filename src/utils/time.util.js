export function getTodayDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function minutesBetween(startTimestamp, endTimestamp) {
  const diffMs = endTimestamp - startTimestamp;
  return Math.max(1, Math.floor(diffMs / 60000)); // minimum 1 min
}
