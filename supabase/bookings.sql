create table
  public.bookings (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    provider_id uuid not null,
    service_id uuid not null,
    customer_name text not null,
    customer_email text not null,
    booking_datetime timestamp with time zone not null,
    notes text null,
    status text not null default 'pending'::text,
    duration integer not null,
    price numeric(10, 2) not null,
    phone_number text null,
    constraint bookings_pkey primary key (id),
    constraint bookings_provider_id_fkey foreign key (provider_id) references auth.users (id),
    constraint bookings_service_id_fkey foreign key (service_id) references services (id)
  ) tablespace pg_default;