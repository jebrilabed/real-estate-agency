# Routes

The active routing convention is the Next.js App Router. Route entry points live
in the top-level `app/` directory. Page components stay in `src/routes/` and
are imported by the matching `app/**/page.tsx` files.

| App Router file                  | URL             |
| -------------------------------- | --------------- |
| `app/page.tsx`                   | `/`             |
| `app/properties/page.tsx`        | `/properties`   |
| `app/property/[id]/page.tsx`     | `/property/:id`  |
| `app/dashboard/page.tsx`         | `/dashboard`    |
| `app/publish/page.tsx`           | `/publish`       |
