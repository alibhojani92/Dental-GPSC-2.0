const MOTIVATIONS = {
  START: [
    "Treat every MCQ like the real GPSC paper. Accuracy matters.",
  ],
  CORRECT: [
    "One correct concept today saves marks in the final exam.",
  ],
  WRONG: [
    "Mistakes corrected now won’t repeat in GPSC Dental Class-2.",
  ],
  TIMEUP: [
    "Time management is as important as knowledge in GPSC.",
  ],
  END: [
    "Consistency today builds selection confidence tomorrow.",
  ],
};

export function getMotivation(type) {
  const list = MOTIVATIONS[type] || [];
  return list.length ? `\n\n🔹 ${list[0]}` : "";
}
