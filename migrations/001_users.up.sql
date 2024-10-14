-- users table

create type user_role as enum ('user', 'admin');

create table "users" (
  "id" uuid references auth."users" primary key,
  "email" text not null,
  "role" user_role not null default 'user',
  "full_name" text
);
alter table "users" enable row level security;

create index "users_email" on "users" ("email");

create function handle_new_user()
  returns trigger
  language plpgsql
  security definer
as $$
begin
  insert into public."users" (
    "id",
    "email",
    "full_name",
    "role"
  ) values (
    new."id",
    new."email",
    new."raw_user_meta_data"->>'full_name',
    'user'
  ) on conflict ("id") do update set
    "email" = excluded."email",
    "full_name" = excluded."full_name";

  return new;
end;
$$;

create trigger "on_auth_user_created"
after insert or update on auth."users"
for each row execute procedure public."handle_new_user"();

create or replace function get_user_role("user_id" uuid)
  returns text
  stable
  language sql
  security definer
as $$
  select "role"
  from public."users"
  where "id" = $1
$$;

create or replace function is_admin()
  returns boolean
  stable
  language sql
  security definer
as $$
  select "role" = 'admin' or auth.jwt() ->> 'role' = 'service_role'
  from public."users"
  where "id" = auth.uid()
$$;

create policy "Admins have full control over users."
on "users" for all using (is_admin());

create policy "Users can view their own profiles."
on "users" for select using (auth.uid() = "id");

create view user_profile as
select
  u."id",
  u."role",
  u."email",
  u."full_name"
from "users" as u
where auth.uid() = u."id";
