const STUDY_KEY_PREFIX = "study_session:";

/**
 * Start a study session (KV only)
 */
export async function startStudySession(KV, userId, subjectId, topicId) {
  const key = STUDY_KEY_PREFIX + userId;

  const existing = await KV.get(key);
  if (existing) {
    return { alreadyRunning: true };
  }

  const payload = {
    subjectId,
    topicId,
    startTimestamp: Date.now(),
  };

  await KV.put(key, JSON.stringify(payload));
  return { started: true };
}

/**
 * Stop a study session and return data
 */
export async function stopStudySession(KV, userId) {
  const key = STUDY_KEY_PREFIX + userId;
  const raw = await KV.get(key);

  if (!raw) {
    return null;
  }

  await KV.delete(key);
  return JSON.parse(raw);
}

/**
 * Get active session (for resume protection)
 */
export async function getActiveStudySession(KV, userId) {
  const key = STUDY_KEY_PREFIX + userId;
  const raw = await KV.get(key);
  return raw ? JSON.parse(raw) : null;
}
