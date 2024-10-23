# cloud-computing-systems
Repo for Cloud Computing Systems class at TUL

## To start all Supabase services locally (Docker required)
```bash
# only on the first run
npm install
# only on the first run
npx supabase login

npx supabase start

# when you are done coding use
npx supabase stop
```

## Setting up the database schema (Go required)

```bash
make migrate DB_URI=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## Email testing server

Emails sent with the local dev setup are not actually sent - rather, they
are monitored, and you can view the emails that would have been sent from the web interface hosted at
`http://localhost:54324`

## Frontend development with hosted supabase

```bash
cd web

npm i

# only the first time
cp ./.env.example ./.env.local
# comment out the local env variables

npm run dev
```