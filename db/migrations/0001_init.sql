-- HerDay landing — initial schema.
-- Run with: npx tsx scripts/migrate.ts

create extension if not exists pgcrypto;

create table if not exists scheduled_letters (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  scheduled_for timestamptz not null,
  body text not null,
  sign_off text not null,
  future_age integer not null,
  -- delivery state
  sent_at timestamptz,
  send_attempts integer not null default 0,
  last_error text,
  resend_message_id text,
  created_at timestamptz not null default now()
);

-- Hot index: cron query reads only unsent rows whose schedule is due.
create index if not exists idx_scheduled_letters_due
  on scheduled_letters (scheduled_for)
  where sent_at is null;

create index if not exists idx_scheduled_letters_email
  on scheduled_letters (email);

create table if not exists rate_limits (
  ip_hash text not null,
  day date not null,
  count integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (ip_hash, day)
);

-- Garbage-collected by daily cron (`delete from rate_limits where day < current_date - 30`).
