create table
  public.weekday_availability (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    weekdays integer[] null default '{}'::integer[],
    availability jsonb null default '{}'::jsonb,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint weekday_availability_pkey primary key (id),
    constraint weekday_availability_user_id_key unique (user_id),
    constraint weekday_availability_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;