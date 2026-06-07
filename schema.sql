-- ============================================================
-- Flashcard App — Supabase Schema
-- Cole este SQL no SQL Editor do seu projeto Supabase
-- ============================================================

-- Tabela de baralhos
create table if not exists public.decks (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text default '',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Tabela de cartões
create table if not exists public.cards (
  id             uuid primary key default gen_random_uuid(),
  deck_id        uuid not null references public.decks(id) on delete cascade,
  front          text not null,
  back           text not null,
  position       integer default 0,
  times_reviewed integer default 0,
  times_correct  integer default 0,
  last_reviewed  timestamptz,
  created_at     timestamptz default now()
);

-- Índices
create index if not exists cards_deck_id_idx on public.cards(deck_id);
create index if not exists cards_position_idx on public.cards(deck_id, position);

-- Auto-update updated_at em decks
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_deck_updated on public.decks;
create trigger on_deck_updated
  before update on public.decks
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- Como é uso pessoal sem auth, deixamos tudo público
-- para a chave anon. Se quiser restringir depois, ajuste aqui.
-- ============================================================

alter table public.decks enable row level security;
alter table public.cards enable row level security;

-- Políticas abertas (uso pessoal)
create policy "allow_all_decks" on public.decks for all using (true) with check (true);
create policy "allow_all_cards" on public.cards for all using (true) with check (true);
