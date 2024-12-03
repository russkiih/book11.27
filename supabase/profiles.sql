create table
  public.profiles (
    id uuid not null,
    email text null,
    username text null,
    full_name text null,
    avatar_url text null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint profiles_pkey primary key (id),
    constraint profiles_username_key unique (username),
    constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade
  ) tablespace pg_default;