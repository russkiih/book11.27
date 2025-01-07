create table
  public.availability_schedules (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    day_of_week integer not null,
    is_available boolean null default true,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint availability_schedules_pkey primary key (id),
    constraint availability_schedules_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
    constraint availability_schedules_day_of_week_check check (
      (
        (day_of_week >= 0)
        and (day_of_week <= 6)
      )
    )
  ) tablespace pg_default;

create index if not exists idx_availability_user_id on public.availability_schedules using btree (user_id) tablespace pg_default;

create trigger handle_updated_at_availability before
update on availability_schedules for each row
execute function handle_updated_at ();