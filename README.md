This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Setup

Gunakan file env bawaan Next.js supaya URL backend berbeda saat development dan production.

### 1. Buat file env

Untuk development:

```env
# .env.development
BACKEND_PREDICT_URL=http://127.0.0.1:8000/predict
```

Untuk production:

```env
# .env.production
BACKEND_PREDICT_URL=https://api-domain-kamu.com/predict
```

`BACKEND_PREDICT_URL` dibaca di route server [src/app/api/predict/route.ts](/E:/PENS/D4%20LJ/TA/predict/frontend/src/app/api/predict/route.ts), jadi variabel ini tidak perlu dibuat `NEXT_PUBLIC_`.

### 2. Cara manggil dari komponen

Dari komponen client, cukup panggil endpoint internal Next.js:

```ts
const response = await fetch("/api/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

Komponen [src/components/feature/predict/PredictFeature.tsx](/E:/PENS/D4%20LJ/TA/predict/frontend/src/components/feature/predict/PredictFeature.tsx) sekarang sudah memakai pola ini.

### 3. Jalankan project

Saat `npm run dev`, Next.js akan memakai `.env.development`.
Saat `npm run build` lalu `npm run start`, Next.js akan memakai `.env.production`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
