# Stack icons

Diambil dari [Simple Icons](https://github.com/simple-icons/simple-icons)
v13 (`https://cdn.jsdelivr.net/npm/simple-icons@13/icons/<slug>.svg`).

Lisensi: **CC0 1.0 Universal** — bebas dipakai tanpa atribusi. Merek dagang
tetap milik masing-masing pemiliknya.

Sengaja di-vendor ke repo, bukan di-load dari CDN saat runtime: tidak ada
permintaan ke pihak ketiga, tidak ada layout shift, dan halaman tetap jalan
tanpa jaringan. Semua file single-path `viewBox="0 0 24 24"`, dipakai sebagai
CSS mask di `.stack-ico` (lihat `src/index.css`) supaya warnanya bisa
mengikuti token palet.
