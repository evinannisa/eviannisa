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

## Pengecualian: `maplibre.svg`

Bukan dari Simple Icons — MapLibre tidak ada di sana. Berkasnya diturunkan
dari ikon aplikasi MapLibre, lalu disamakan bentuknya dengan yang lain:
kotak latar birunya dibuang, warnanya dilepas, dan isinya dipas ke
`viewBox="0 0 24 24"` lewat satu `transform` di elemen `<g>` supaya data
jalurnya tetap sama persis dengan aslinya.

Lubang di tengah pin-nya bergantung pada `fill-rule="evenodd"` - tanpa itu
lingkaran dalamnya ikut terisi dan pin-nya jadi gumpalan padat.

Lisensinya belum diverifikasi seperti berkas Simple Icons di atas; kalau
portofolio ini dipakai komersial, konfirmasi dulu ke ketentuan merek MapLibre.
