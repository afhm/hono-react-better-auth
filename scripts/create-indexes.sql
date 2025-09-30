-- Database Performance Indexes
-- Run this script on your production database to create indexes

-- Todos table indexes
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos(user_id);
CREATE INDEX IF NOT EXISTS todos_user_id_created_at_idx ON todos(user_id, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS todos_completed_idx ON todos(completed);

-- Session table indexes (for auth performance)
CREATE INDEX IF NOT EXISTS session_user_id_idx ON session(user_id);
CREATE INDEX IF NOT EXISTS session_expires_at_idx ON session(expires_at);

-- Account table indexes
CREATE INDEX IF NOT EXISTS account_user_id_idx ON account(user_id);
CREATE INDEX IF NOT EXISTS account_provider_account_idx ON account(provider_id, account_id);

-- Analyze tables for query planner optimization
ANALYZE todos;
ANALYZE "user";
ANALYZE session;
ANALYZE account;

-- Show index usage stats (run separately to check)
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- ORDER BY idx_scan DESC;