-- Waitlist subscribers + onboarding-sequence progress.
--
-- One row per email. Resend Audience is the source of truth for SENDING;
-- this table is our own mirror for backup, dedupe, unsubscribe tokens, and
-- driving the drip sequence from our daily cron (mirrors scheduled_letters).

create extension if not exists pgcrypto;

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text,                              -- 'cta' | 'pricing' | ...
  resend_contact_id text,                   -- id returned by resend.contacts.create

  -- one-click unsubscribe (List-Unsubscribe + footer link)
  unsub_token text not null default encode(gen_random_bytes(16), 'hex'),
  unsubscribed boolean not null default false,
  unsubscribed_at timestamptz,

  -- onboarding sequence progress.
  -- step 0 (welcome) is sent transactionally on signup. next_step is the
  -- NEXT step the cron should send; next_send_at is when it is due.
  next_step integer not null default 1,
  next_send_at timestamptz,                 -- null = sequence complete / nothing due
  last_sent_step integer,
  last_sent_at timestamptz,
  send_attempts integer not null default 0, -- attempts on the CURRENT next_step
  last_error text,

  created_at timestamptz not null default now()
);

-- Hot index: cron reads only subscribed rows with a due step.
create index if not exists idx_subscribers_due
  on subscribers (next_send_at)
  where unsubscribed = false and next_send_at is not null;

create unique index if not exists idx_subscribers_unsub_token
  on subscribers (unsub_token);
