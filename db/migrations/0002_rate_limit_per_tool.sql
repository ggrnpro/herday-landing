-- Make rate_limits tool-aware so each free tool has its own daily counter
-- per IP (letter, affirmation, etc.). Existing rows are treated as letter
-- generations.

alter table rate_limits
  add column if not exists tool text not null default 'letter';

-- Replace the old (ip_hash, day) primary key with a (ip_hash, day, tool)
-- composite. We have to drop and re-add because PG doesn't support
-- altering pk columns directly.

alter table rate_limits drop constraint if exists rate_limits_pkey;
alter table rate_limits
  add constraint rate_limits_pkey primary key (ip_hash, day, tool);
