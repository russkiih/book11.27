create table
  public.services (
    id uuid not null default gen_random_uuid (),
    name text not null,
    description text null,
    duration integer not null,
    price numeric(10, 2) not null,
    user_id uuid not null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint services_pkey primary key (id),
    constraint services_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
    constraint services_duration_check check ((duration >= 5)),
    constraint services_price_check check ((price >= (0)::numeric))
  ) tablespace pg_default;

create index if not exists idx_services_user_id on public.services using btree (user_id) tablespace pg_default;

create trigger handle_updated_at_services before
update on services for each row
execute function handle_updated_at ();