/* Pemetaan nama stack ke slug file di public/assets/icons.

   Peta ini sengaja TIDAK memuat semua nama yang dipakai proyek, karena banyak
   entri (GeoJSON, Places API, Playwright, Katalon Studio, Google OAuth 2.0)
   belum punya file ikon. Nama yang tidak terdaftar bukan error, dan pemakainya
   harus menyiapkan tampilan tanpa ikon.

   `stackIcon()` menjadi satu-satunya jalan untuk mendapatkan URL ikon, agar
   tidak ada yang merangkai `url(/assets/icons/${name}.svg)` langsung dari nama
   stack. Nama yang belum dipetakan akan menghasilkan URL 404 tanpa error yang
   terlihat (mask kosong = kotak transparan).

   Catatan: src/components/SkillList.tsx masih menyimpan salinan peta ini, tetapi
   salinan itu tidak dipakai karena hanya dirujuk dari blok JSX yang dikomentari.
   Jika ikon di sana diaktifkan lagi, hapus salinannya dan gunakan file ini. */
const STACK_ICON: Record<string, string> = {
  "Next.js": "nextdotjs",
  "Vue.js": "vuedotjs",
  "Astro.js": "astro",
  React: "react",
  TypeScript: "typescript",
  JavaScript: "javascript",
  Python: "python",
  "TanStack Query": "reactquery",
  "Tailwind CSS": "tailwindcss",
  Tailwind: "tailwindcss",
  "Google Maps JS API": "googlemaps",
  "MapLibre GL JS": "maplibre",
  Jest: "jest",
  Golang: "go",
  "Express.js": "express",
  JWT: "jsonwebtokens",
  "Auth & Authorization": "auth0",
  Swagger: "swagger",
  Postman: "postman",
  PostgreSQL: "postgresql",
  MongoDB: "mongodb",
  "Prisma ORM": "prisma",
  Drizzle: "drizzle",
  Docker: "docker",
  MinIO: "minio",
  Resend: "resend",
  "Resend API": "resend",
  Nginx: "nginx",
  Jenkins: "jenkins",
  Git: "git",
  GitHub: "github",
  GitLab: "gitlab",
};

/* Koreksi optis, terpisah dari ukuran yang diminta pemakai.

   `mask-size: contain` di `.stack-logo` memasukkan seluruh `viewBox` 24x24 ke
   dalam kotak, BUKAN hanya tintanya. Akibatnya, dua ikon dengan ukuran kotak
   yang sama bisa terlihat sangat berbeda, tergantung seberapa penuh tintanya
   mengisi kanvas. Hasil pengukuran file ikon (persen piksel bertinta, median
   seluruh folder ~32%):

     go       18% tinta, tingginya hanya 37% kanvas. Lambangnya lebar dan
              pendek, jadi lima per delapan kotak kosong di atas dan bawah,
              sehingga ikon terlihat lebih kecil dari yang lain.
     resend   41% tinta, mengisi 99% x 100% kanvas. Tidak ada ruang kosong,
              sehingga ikon terlihat paling besar dan paling berat.

   Faktor skalanya disesuaikan dengan median tersebut, bukan angka bulat asal:
   18% x 1.25^2 ~= 28%, 41% x 0.85^2 ~= 30%. Ikon yang tidak terdaftar tetap 1,
   karena sebagian besar ikon Simple Icons sudah seimbang.

   Yang diubah adalah `--size`, bukan `mask-size`. Memperbesar mask melewati
   `contain` membuat lambang keluar dari kotak elemen dan terpotong. Pada `go`
   yang tintanya sudah selebar kanvas, sisi kiri dan kanannya akan hilang.
   Karena itu kotaknya yang harus diperbesar. */
const ICON_SCALE: Record<string, number> = {
  go: 1.25,
  resend: 0.85,
};

export function stackIconScale(name: string): number {
  const slug = STACK_ICON[name];
  return (slug && ICON_SCALE[slug]) || 1;
}

export function stackIcon(name: string): string | undefined {
  const slug = STACK_ICON[name];
  return slug ? `url(/assets/icons/${slug}.svg)` : undefined;
}
