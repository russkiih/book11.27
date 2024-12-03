-- Table for storing weekday availability
create table weekday_availability (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  weekdays integer[] not null default '{1,2,3,4,5}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Table for storing hours availability
create table hours_availability (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  hours integer[] not null default '{9,10,11,12,13,14,15,16,17}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Add RLS policies
alter table weekday_availability enable row level security;
alter table hours_availability enable row level security;

-- Policies for weekday_availability
create policy "Users can view their own weekday availability"
  on weekday_availability for select
  using (auth.uid() = user_id);

create policy "Users can update their own weekday availability"
  on weekday_availability for update
  using (auth.uid() = user_id);

create policy "Users can insert their own weekday availability"
  on weekday_availability for insert
  with check (auth.uid() = user_id);

-- Policies for hours_availability
create policy "Users can view their own hours availability"
  on hours_availability for select
  using (auth.uid() = user_id);

create policy "Users can update their own hours availability"
  on hours_availability for update
  using (auth.uid() = user_id);

create policy "Users can insert their own hours availability"
  on hours_availability for insert
  with check (auth.uid() = user_id);

-- Public policies for viewing availability
create policy "Anyone can view availability"
  on weekday_availability for select
  using (true);

create policy "Anyone can view hours"
  on hours_availability for select
  using (true); 