insert into storage.buckets (id, name)
values ('uploads', 'uploads');

create policy "Users have full control over their objects 1va6avm_0"
on "storage"."objects"
as permissive
for select
to public
using ((((bucket_id = 'uploads'::text) AND (owner_id = (auth.uid())::text)) OR is_admin()));

create policy "Users have full control over their objects 1va6avm_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((((bucket_id = 'uploads'::text) AND (owner_id = (auth.uid())::text)) OR is_admin()));

create policy "Users have full control over their objects 1va6avm_2"
on "storage"."objects"
as permissive
for update
to public
using ((((bucket_id = 'uploads'::text) AND (owner_id = (auth.uid())::text)) OR is_admin()));

create policy "Users have full control over their objects 1va6avm_3"
on "storage"."objects"
as permissive
for delete
to public
using ((((bucket_id = 'uploads'::text) AND (owner_id = (auth.uid())::text)) OR is_admin()));