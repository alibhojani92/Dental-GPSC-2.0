PRAGMA foreign_keys = ON;

-- =========================
-- 1. USERS
-- =========================
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL UNIQUE,
  username TEXT,
  first_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 2. SUBJECTS (Dental Pulse)
-- =========================
CREATE TABLE subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  volume INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1
);

-- =========================
-- 3. TOPICS
-- =========================
CREATE TABLE topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- =========================
-- 4. MCQs
-- =========================
CREATE TABLE mcqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  correct_option TEXT NOT NULL,
  explanation TEXT NOT NULL,
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (topic_id) REFERENCES topics(id)
);

-- =========================
-- 5. MCQ OPTIONS
-- =========================
CREATE TABLE mcq_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mcq_id INTEGER NOT NULL,
  option_key TEXT NOT NULL,
  option_text TEXT NOT NULL,
  FOREIGN KEY (mcq_id) REFERENCES mcqs(id)
);

-- =========================
-- 6. STUDY LOGS
-- =========================
CREATE TABLE study_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  topic_id INTEGER NOT NULL,
  minutes INTEGER NOT NULL,
  study_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- 7. TEST ATTEMPTS
-- =========================
CREATE TABLE test_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_type TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct INTEGER NOT NULL,
  wrong INTEGER NOT NULL,
  time_up INTEGER NOT NULL,
  accuracy REAL NOT NULL,
  attempt_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- 8. QUESTION ATTEMPTS
-- =========================
CREATE TABLE question_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  mcq_id INTEGER NOT NULL,
  selected_option TEXT,
  is_correct INTEGER NOT NULL,
  is_time_up INTEGER NOT NULL,
  attempt_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (mcq_id) REFERENCES mcqs(id)
);

-- =========================
-- 9. DAILY TARGETS
-- =========================
CREATE TABLE daily_targets (
  user_id INTEGER PRIMARY KEY,
  minutes INTEGER NOT NULL,
  locked INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- 10. STREAKS
-- =========================
CREATE TABLE streaks (
  user_id INTEGER PRIMARY KEY,
  current_streak INTEGER NOT NULL,
  best_streak INTEGER NOT NULL,
  last_active_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- 11. RANK SNAPSHOT
-- =========================
CREATE TABLE ranks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  score REAL NOT NULL,
  rank_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- 12. WEAK AREAS
-- =========================
CREATE TABLE weak_areas (
  user_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  wrong_count INTEGER NOT NULL,
  PRIMARY KEY (user_id, subject_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- =========================
-- 13. USER SETTINGS
-- =========================
CREATE TABLE user_settings (
  user_id INTEGER PRIMARY KEY,
  notifications INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- 14. ADMIN LOGS
-- =========================
CREATE TABLE admin_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- INDEXES
-- =========================
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_mcqs_subject ON mcqs(subject_id);
CREATE INDEX idx_question_attempts_user ON question_attempts(user_id);
CREATE INDEX idx_study_logs_user_date ON study_logs(user_id, study_date);
