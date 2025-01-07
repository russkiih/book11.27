create table
  public.time_slots (
    id uuid not null default gen_random_uuid (),
    schedule_id uuid not null,
    start_time time without time zone not null,
    end_time time without time zone not null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint time_slots_pkey primary key (id),
    constraint time_slots_schedule_id_fkey foreign key (schedule_id) references availability_schedules (id) on delete cascade,
    constraint valid_time_range check ((start_time < end_time))
  ) tablespace pg_default;

create trigger handle_updated_at_time_slots before
update on time_slots for each row
execute function handle_updated_at ();