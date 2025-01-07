create table
  public.hours_availability (
    id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid not null,
    hours integer[] not null default '{9,10,11,12,13,14,15,16,17}'::integer[],
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
    constraint hours_availability_pkey primary key (id),
    constraint hours_availability_user_id_key unique (user_id),
    constraint hours_availability_user_id_fkey foreign key (user_id) references auth.users (id)
  ) tablespace pg_default;