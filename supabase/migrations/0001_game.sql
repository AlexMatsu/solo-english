-- ============================================================
-- Solo English — backend de gamificação (v1)
-- Rode este script no Supabase: Dashboard → SQL Editor → New query → Run
-- ============================================================

-- ---------- PERFIL DO JOGADOR ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  level       int  not null default 1,
  xp          int  not null default 0,
  gold        int  not null default 0,
  lives       int  not null default 5,
  streak      int  not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- ---------- PROGRESSO DAS LIÇÕES ----------
create table if not exists public.user_lessons (
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_id    text not null,
  status       text not null default 'completed',
  xp_earned    int  not null default 0,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.user_lessons enable row level security;

drop policy if exists "lessons_select_own" on public.user_lessons;
create policy "lessons_select_own" on public.user_lessons
  for select using (auth.uid() = user_id);

drop policy if exists "lessons_all_own" on public.user_lessons;
create policy "lessons_all_own" on public.user_lessons
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- CRIA PERFIL AUTOMATICAMENTE NO CADASTRO ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: cria perfil (nível 1) para contas que já existem
insert into public.profiles (id, name)
select id, coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;

-- ---------- REGRA DE NEGÓCIO: COMPLETAR LIÇÃO ----------
-- Marca a lição como concluída, dá XP (só na 1ª vez) e recalcula o nível.
-- Regra: 100 XP por nível (nível = 1 + floor(xp/100)).
create or replace function public.complete_lesson(p_lesson_id text, p_xp int)
returns public.profiles
language plpgsql security definer set search_path = public as $$
declare
  v_uid     uuid := auth.uid();
  v_already boolean;
  v_profile public.profiles;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  insert into public.profiles (id) values (v_uid) on conflict (id) do nothing;

  select exists(
    select 1 from public.user_lessons
    where user_id = v_uid and lesson_id = p_lesson_id and status = 'completed'
  ) into v_already;

  insert into public.user_lessons (user_id, lesson_id, status, xp_earned)
  values (v_uid, p_lesson_id, 'completed', p_xp)
  on conflict (user_id, lesson_id)
    do update set status = 'completed', completed_at = now();

  if not v_already then
    update public.profiles
      set xp    = xp + p_xp,
          level = 1 + floor((xp + p_xp) / 100)
      where id = v_uid
      returning * into v_profile;
  else
    select * into v_profile from public.profiles where id = v_uid;
  end if;

  return v_profile;
end; $$;

grant execute on function public.complete_lesson(text, int) to authenticated;
