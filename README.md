# Photography100
Gurukul Photography

# Photography100 — class photo uploads & PPT hosting

This repository contains a Next.js + Supabase + S3 starter scaffold for a class site:
- One PPT per week (downloadable .pptx + in-browser PDF view)
- Students can upload up to 20 photos per week
- Federated login via Google and Microsoft (Supabase Auth)
- Teacher dashboard for moderation and gallery view
- Image processing (thumbnail/web-sized) via a Lambda function

Quick start (local)
1. Clone
   git clone https://github.com/starmap1/Photography100.git
   cd Photography100

2. Install
   npm install

3. Create a Supabase project and configure Google & Microsoft OAuth providers. Copy:
    - NEXT_PUBLIC_SUPABASE_URL
    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    - SUPABASE_SERVICE_ROLE_KEY

4. Create an S3 bucket and an IAM user with permissions to PutObject/GetObject.
    - S3_BUCKET_NAME, S3_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY

5. Create a Postgres connection string for Lambda/server updates:
    - PG_CONNECTION

6. Copy env vars to .env.local:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   S3_BUCKET_NAME=...
   S3_REGION=...
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   PG_CONNECTION=...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

7. Run locally:
   npm run dev
   Open http://localhost:3000

Deploy
- Deploy the Next.js app to Vercel (set environment variables there).
- Provision S3 + CloudFront. Ensure CloudFront origin access is configured so objects are not public.
- Deploy the thumbnail/processor Lambda and set an S3 ObjectCreated trigger.
- Run SQL migration in db/migrations/001_init.sql (via supabase SQL editor or psql).

Notes
- Keep SUPABASE_SERVICE_ROLE_KEY and AWS secrets server-side only.
- Files are uploaded private to S3 via presigned PUT URLs issued by the server.
- The server enforces the 20-photo/week quota at presign time.