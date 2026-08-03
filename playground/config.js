/* ============================================================
   The GYM — deployment configuration

   Leave this exactly as it is and everything still works: the
   Hall of Fame runs in local mode, showing your own progress on
   this device. No account, no server, no setup.

   To run a SHARED Hall of Fame across everyone who visits your
   copy, create a free Supabase project and paste its URL and
   anon key below.

   The anon key is designed to be public — it is safe in a public
   repository. Row Level Security (see the policies in the SQL
   below) is what actually protects the table. Never put the
   `service_role` key here.

   ------------------------------------------------------------
   Run this once in the Supabase SQL editor:

     create table public.gym_athletes (
       username     text primary key,
       display_name text not null,
       xp           integer not null default 0,
       level        integer not null default 1,
       cleared      integer not null default 0,
       lessons_done integer not null default 0,
       streak       integer not null default 0,
       courses      text[]  not null default '{}',
       updated_at   timestamptz not null default now()
     );

     alter table public.gym_athletes enable row level security;

     -- Anyone may read the board.
     create policy "read board" on public.gym_athletes
       for select using (true);

     -- Anyone may add themselves or update their own row.
     create policy "write own row" on public.gym_athletes
       for insert with check (true);
     create policy "update own row" on public.gym_athletes
       for update using (true) with check (true);

   ------------------------------------------------------------
   This is a deliberately open, low-stakes leaderboard: there are
   no passwords, so someone determined could overwrite another
   name. That is an accepted trade for zero-friction sign-up on a
   learning site. Do not put anything sensitive in it.
   ============================================================ */

export const SUPABASE = {
  url: '',      // e.g. 'https://abcdefgh.supabase.co'
  anonKey: '',  // the public anon key
  table: 'gym_athletes',
};

/** Branding, in one place so forks can rename easily. */
export const BRAND = {
  name: 'The GYM',
  tagline: 'Train your programming.',
  short: 'GYM',
};

/** Cloud auth — admin public key for account recovery encryption.
 * 
 *  registerToken: GitHub fine-grained PAT with ONLY "actions: write" scope
 *  on the standalone repo (Th3Samaritan/the-gym). Leave blank to disable.
 */
export const CLOUD_AUTH = {
  adminPublicKey: 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAnJ7TmI7P6m/fSzJlXQ4pyyotzBCKeKw5VatZL//zSwXpttB9qMpi06Z2C2WH9vs4KVPz1wCwX0ic4EOlyWP0VF4Kj7r5zEBx0IiFEtf0F7MKPJNC1gXsCwvndnF6T2YqReLdUz1us1WOYuNaPpO4kWgkvdhduYH+K2TaZk68qJcE18g8Jabu6Obxq1ZLDYgvGD73ok8VK6zDwa4iIAfAILoeHhaR4gMH97LbqUpS/5cvOOdvmixqyhCnbvOHQT2jjOOUwb8GafdXJEAHNlx7GKDX08qubOjzM+nxTC3qm1A85dmZryEM8Sv176IXOMYC0tHo4OESmX7TfN8a4kSKu5m+7Cc/ctlL6186Gygea0On6ugXz42PtTlRlQ+WQVR0K9Y8KFi3YusfV3gLbjqXChvFCq8ameeTIop+P7QjuAsqd+5IRSogwS4CL7yj3dPdalz9AbMsDwlwRJpucFX1ZCExC6eWya2TFhIzaiDQluhBe9SFBzu81FiPYJJenJ5rgCFWzsD7PXG2GVAvicmM09ITee2LcvjY8imlmqNhMGh7dLPeYONcrYwqP/bnEhCGy1hpyMV3ba/SjcI1J40DSUxAFugAlfWY5+Bl2tJyBG/RYKGOCBS9mszs24BpUdKo2KwMcfVyk8DDifR0CqpUFHOBAFTtyAoqsP0qGatG9XcCAwEAAQ==',
  registerToken: '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', // GitHub fine-grained PAT with "actions: write" scope on Th3Samaritan/the-gym
};
