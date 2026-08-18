# Walkthrough: Migrasi Penuh ke Next.js (Fullstack) + Supabase + Drizzle

Kami telah mengubah project portofolio Anda dari **Vite SPA** menjadi aplikasi **Next.js App Router (Fullstack)** yang berjalan dengan Supabase dan Drizzle ORM di sisi server.

## Perubahan Utama

1.  **[package.json](file:///Users/snowy/Dev/Personal/Portfolio/package.json)**
    *   Mengganti `vite` dengan `next` framework.
    *   Menambahkan `next` ke dependensi utama.
    *   Menambahkan `postcss` dan `@tailwindcss/postcss` untuk memproses Tailwind v4 di Next.js.
2.  **Inisialisasi Database Server-side**
    *   Membuat konektor database Drizzle di **[src/db/index.ts](file:///Users/snowy/Dev/Personal/Portfolio/src/db/index.ts)** menggunakan library `postgres` untuk dipanggil dari server.
3.  **Next.js API Route**
    *   Membuat route API **[src/app/api/messages/route.ts](file:///Users/snowy/Dev/Personal/Portfolio/src/app/api/messages/route.ts)** untuk menangani permintaan database secara aman di sisi server menggunakan Drizzle ORM.
4.  **Struktur Folder Halaman (`src/app/`)**
    *   **[src/app/layout.tsx](file:///Users/snowy/Dev/Personal/Portfolio/src/app/layout.tsx)** & **[src/components/LayoutWrapper.tsx](file:///Users/snowy/Dev/Personal/Portfolio/src/components/LayoutWrapper.tsx)**: Kerangka dasar layout portofolio.
    *   **[src/app/page.tsx](file:///Users/snowy/Dev/Personal/Portfolio/src/app/page.tsx)**: Halaman Home.
    *   **[src/app/about/page.tsx](file:///Users/snowy/Dev/Personal/Portfolio/src/app/about/page.tsx)**: Halaman About.
    *   **[src/app/projects/page.tsx](file:///Users/snowy/Dev/Personal/Portfolio/src/app/projects/page.tsx)**: Halaman Projects.
    *   **[src/app/writing/page.tsx](file:///Users/snowy/Dev/Personal/Portfolio/src/app/writing/page.tsx)**: Halaman Writing.
    *   **[src/app/chat/page.tsx](file:///Users/snowy/Dev/Personal/Portfolio/src/app/chat/page.tsx)**: Halaman Live Chat yang melakukan `fetch()` ke API route internal Next.js `/api/messages`.
5.  **[postcss.config.mjs](file:///Users/snowy/Dev/Personal/Portfolio/postcss.config.mjs)** & **[next.config.ts](file:///Users/snowy/Dev/Personal/Portfolio/next.config.ts)**
    *   Konfigurasi pendukung build untuk Next.js dan Tailwind v4.

---

## Langkah Verifikasi Selanjutnya

Untuk menjalankan aplikasi ini secara lokal:

1.  Jalankan instalasi dependensi baru:
    ```bash
    pnpm install
    ```
2.  Pastikan file `.env` di root direktori Anda memiliki isi berikut:
    ```env
    DATABASE_URL=postgresql://postgres:your-db-password@db.your-project.supabase.co:5432/postgres
    ```
3.  Sinkronisasikan skema Drizzle ke Supabase:
    ```bash
    pnpm drizzle-kit push
    ```
4.  Jalankan server Next.js lokal:
    ```bash
    pnpm dev
    ```
