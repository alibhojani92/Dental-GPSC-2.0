const ALLOWED_CALLBACKS = [
  "MENU_STUDY",
  "MENU_TEST",
  "MENU_PERFORMANCE",
  "MENU_REVISION",
  "MENU_SCHEDULE",
  "MENU_STREAK",
  "MENU_SETTINGS",
  "MENU_HELP",
];

export function isValidCallback(data) {
  return ALLOWED_CALLBACKS.includes(data);
}
