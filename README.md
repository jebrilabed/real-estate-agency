# دار فلسطين

Real estate marketplace for Palestine, built with Next.js App Router, React, TypeScript, Tailwind CSS, and Supabase. The project can still be edited in [Lovable](https://lovable.dev).

## Run locally

1. Install Node.js 20.9 or newer.
2. Copy `.env.example` to `.env.local` and enter the Supabase URL and publishable key from the Lovable dashboard.
3. Install dependencies and start Next.js:

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```sh
npm run build
npm run start
```

The public listing API uses the Supabase publishable key and RLS. The dashboard API validates the user's bearer token and also uses the publishable client, keeping database policies as the authorization boundary. The app does not require a service-role key.
