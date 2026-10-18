---
name: module-documentation
description: Analyze and document each backend module in Markdown, including data sources, database tables, table relationships, API endpoints, request and response structures, authorization, and data flow. Use when creating, updating, or reviewing technical documentation for backend modules.
---

# Module Documentation Skill

## Tujuan

Buat dokumentasi teknis untuk setiap module berdasarkan implementasi kode yang sebenarnya.

Dokumentasi harus menjawab pertanyaan berikut:

1. Module ini digunakan untuk apa?
2. Data yang ditampilkan atau diproses berasal dari tabel mana?
3. Kolom apa saja yang digunakan dan bagaimana data tersebut diproses?
4. Tabel tersebut memiliki relasi dengan tabel apa saja?
5. API apa saja yang tersedia untuk module ini?
6. Apa fungsi setiap endpoint, parameter, request, dan response-nya?
7. Bagaimana alur data dari API hingga database?
8. Bagaimana autentikasi, otorisasi, dan validasi diterapkan?
9. Apakah ada data yang masih menggunakan mock atau sample?
10. Apakah module bergantung pada module, service eksternal, atau sumber data lain?

Seluruh dokumentasi dan penjelasan teknis harus menggunakan bahasa Indonesia yang mudah dipahami, formal, dan profesional.

## 1. Inspect the Project First

Sebelum menulis dokumentasi:

1. Periksa struktur repository dan bahasa pemrograman yang digunakan.
2. Identifikasi seluruh module atau feature yang tersedia.
3. Periksa routing, handler, business logic, query database, model, migration, schema, dan konfigurasi yang relevan.
4. Periksa dokumentasi yang sudah ada agar tidak membuat dokumentasi duplikat.
5. Identifikasi mekanisme autentikasi, otorisasi, error handling, dan response yang digunakan bersama.

Ikuti arsitektur project yang sebenarnya.

Jika backend menggunakan feature-based architecture dengan routing, handler, dan business logic dalam satu package, dokumentasikan berdasarkan struktur tersebut. Jangan mengasumsikan bahwa project menggunakan handler, service, dan repository yang terpisah.

Jangan mengubah kode aplikasi hanya untuk menghasilkan dokumentasi.

## 2. Determine the Documentation Scope

Skill dapat dijalankan untuk satu module atau seluruh module.

Jika pengguna menyebut nama module tertentu, dokumentasikan module tersebut beserta dependensi yang relevan.

Jika pengguna meminta seluruh module:

1. Buat inventaris module yang ditemukan.
2. Dokumentasikan setiap module secara terpisah.
3. Buat index yang menghubungkan seluruh dokumentasi.
4. Pastikan tidak ada module yang terlewat tanpa penjelasan.

Jangan menganggap nama folder selalu sama dengan nama module. Verifikasi melalui routing, registrasi feature, dan penggunaan aktual di dalam kode.

## 3. Documentation Output

Simpan dokumentasi dalam format Markdown (`.md`) di dalam folder:

`docs/modules/`

Struktur yang disarankan:

```text
docs/
└── modules/
    ├── README.md
    ├── summary.md
    ├── accounts.md
    ├── activity.md
    └── <nama-module>.md
```

Ketentuan:

-    Satu file untuk setiap module.
-    `README.md` menjadi index dokumentasi seluruh module.
-    Gunakan nama file yang konsisten dengan nama module di project.
-    Gunakan relative links antarfile Markdown.
-    Jika project sudah memiliki konvensi lokasi dokumentasi, ikuti konvensi yang ada.
-    Jangan menimpa dokumentasi yang sudah ada tanpa memeriksa dan mempertahankan informasi yang masih relevan.

## 4. Standard Module Documentation Template

Setiap file module harus mengikuti struktur berikut. Bagian yang tidak relevan dapat ditulis sebagai "Tidak ditemukan" atau "Belum tersedia", disertai konteks jika diperlukan.

### A. Module Overview

Jelaskan:

-    Nama module.
-    Tujuan dan tanggung jawab.
-    Fitur atau fungsi utama.
-    Lokasi kode yang relevan.
-    Module atau package lain yang digunakan.

### B. Data Source

Identifikasi seluruh sumber data yang benar-benar digunakan.

Gunakan tabel berikut:

| Informasi            | Keterangan                                    |
| -------------------- | --------------------------------------------- |
| Nama tabel           | Nama tabel database                           |
| Alias                | Alias tabel dalam query, jika ada             |
| Operasi              | SELECT, INSERT, UPDATE, DELETE, atau lainnya  |
| Kolom yang digunakan | Kolom yang dibaca atau ditulis                |
| Kondisi query        | WHERE, JOIN, filter, dan kondisi lain         |
| Transformasi         | Agregasi, kalkulasi, mapping, atau formatting |
| Tujuan               | Bagian fitur yang menggunakan data tersebut   |

Jelaskan secara spesifik data pada setiap bagian fitur berasal dari mana.

Contohnya, jika sebuah halaman memiliki kartu ringkasan, grafik, dan daftar aktivitas, dokumentasikan sumber data ketiganya secara terpisah apabila sumbernya berbeda.

Bedakan sumber data berikut:

-    Tabel database.
-    Hasil query gabungan beberapa tabel.
-    Data dari module lain.
-    API eksternal.
-    Cache atau data sementara.
-    Mock, sample, atau data statis.

Jangan menyebut data berasal dari database jika implementasi sebenarnya menggunakan nilai hardcoded atau sample.

### C. Database Tables

Buat daftar seluruh tabel yang dibaca atau diubah oleh module.

| Tabel        | Operasi | Fungsi dalam module                   |
| ------------ | ------- | ------------------------------------- |
| `nama_tabel` | SELECT  | Membaca data untuk kebutuhan tertentu |
| `tabel_lain` | UPDATE  | Memperbarui status atau informasi     |

Sertakan tabel yang diakses secara tidak langsung apabila alurnya dapat ditelusuri melalui fungsi atau package yang dipanggil.

Bedakan tabel yang digunakan langsung oleh module dengan tabel yang hanya digunakan oleh dependensinya.

Untuk setiap tabel penting, dokumentasikan kolom yang relevan:

| Kolom    | Tipe data     | Fungsi           | Sumber informasi          |
| -------- | ------------- | ---------------- | ------------------------- |
| `id`     | Sesuai schema | Identitas record | Migration/schema          |
| `status` | Sesuai schema | Status record    | Migration/schema dan kode |

Jangan mengarang tipe data atau nama kolom. Ambil dari schema, migration, ORM model, atau definisi database yang tersedia.

### D. Table Relationships

Dokumentasikan relasi tabel yang terkait dengan module.

| Tabel utama | Kolom penghubung | Tabel terkait | Kolom terkait | Jenis relasi | Dasar bukti       |
| ----------- | ---------------- | ------------- | ------------- | ------------ | ----------------- |
| `table_a`   | `table_b_id`     | `table_b`     | `id`          | Many-to-one  | Foreign key/query |
| `table_c`   | `id`             | `table_d`     | `table_c_id`  | One-to-many  | Foreign key/query |

Untuk setiap relasi, jelaskan:

-    Tabel asal dan tabel tujuan.
-    Kolom yang menghubungkan keduanya.
-    Jenis relasi jika dapat dipastikan.
-    Apakah relasi dinyatakan sebagai foreign key di database.
-    Apakah relasi hanya dibentuk melalui query atau business logic.
-    Bagaimana relasi tersebut digunakan oleh module.

Bedakan bukti relasi berdasarkan kategori berikut:

1. **Foreign key terverifikasi:** constraint ditemukan di schema atau migration.
2. **Relasi berdasarkan query:** kolom dihubungkan melalui JOIN atau kondisi query.
3. **Relasi berdasarkan kode:** hubungan terlihat dari business logic, tetapi constraint database tidak ditemukan.
4. **Relasi belum terverifikasi:** ada indikasi hubungan, tetapi bukti belum cukup.

Jangan menganggap dua tabel memiliki foreign key hanya karena nama kolomnya mirip.

Jika relasi belum dapat dipastikan, jelaskan keterbatasannya.

### E. API Endpoints

Daftar seluruh endpoint yang digunakan atau didaftarkan oleh module.

| Method | Endpoint       | Fungsi         | Akses        | Implementasi |
| ------ | -------------- | -------------- | ------------ | ------------ |
| GET    | `/api/example` | Mengambil data | Sesuai guard | `feature.go` |
| POST   | `/api/example` | Membuat data   | Sesuai guard | `feature.go` |

Untuk setiap endpoint, jelaskan secara terpisah:

#### Endpoint: `METHOD /path`

-    **Tujuan:** fungsi endpoint.
-    **Handler:** fungsi yang menangani request.
-    **Authentication:** mekanisme autentikasi yang diterapkan.
-    **Authorization:** module guard, action permission, role, atau aturan akses lainnya.
-    **Path parameters:** parameter pada URL.
-    **Query parameters:** filter, pagination, periode, sorting, atau parameter lainnya.
-    **Request body:** field, tipe data, validasi, dan field wajib jika ada.
-    **Response:** status HTTP dan struktur JSON.
-    **Error responses:** error yang dapat terjadi berdasarkan implementasi.
-    **Database operations:** tabel yang dibaca atau diubah.
-    **Related modules:** package atau module lain yang dipanggil.

Jika endpoint tidak menerima request body, tuliskan bahwa request body tidak diperlukan.

Jika endpoint hanya mengembalikan data sample, jelaskan dengan jelas.

Jangan membuat contoh request atau response yang bertentangan dengan implementasi aktual.

### F. Data Flow

Jelaskan perjalanan data dari request hingga response.

Contoh pola dokumentasi:

```text
HTTP Request
    ↓
Route registration / authorization guard
    ↓
Handler
    ↓
Business logic
    ↓
Database query atau module dependency
    ↓
Response mapping
    ↓
HTTP Response
```

Diagram tersebut hanya ilustrasi. Sesuaikan dengan alur yang ditemukan di project.

Untuk setiap alur utama, jelaskan:

1. Endpoint yang dipanggil.
2. Validasi dan otorisasi yang dijalankan.
3. Fungsi yang memproses data.
4. Sumber data yang digunakan.
5. Transformasi yang dilakukan.
6. Response yang dikembalikan ke frontend.

Untuk operasi tulis, jelaskan perubahan data dan penanganan kegagalannya apabila dapat diverifikasi dari kode.

### G. Request and Response Schema

Dokumentasikan struktur request dan response yang sebenarnya.

Contoh:

| Field    | Tipe                | Sumber                  | Keterangan       |
| -------- | ------------------- | ----------------------- | ---------------- |
| `id`     | Sesuai implementasi | Database                | Identitas record |
| `status` | Sesuai implementasi | Database/business logic | Status record    |

Untuk response JSON, sertakan contoh ringkas berdasarkan struct atau mapping aktual.

Perhatikan:

-    JSON field tags.
-    Field opsional dan pointer.
-    Field yang dapat bernilai `null`.
-    Field yang memiliki nilai default.
-    Field yang dihitung oleh backend.
-    Field yang berasal dari tabel berbeda.
-    Field yang hanya tersedia pada kondisi atau role tertentu.

Jangan memasukkan token, password, secret, data pribadi nyata, atau informasi sensitif ke contoh dokumentasi.

### H. Validation and Business Rules

Dokumentasikan aturan yang benar-benar diterapkan:

-    Validasi input.
-    Validasi status.
-    Pembatasan berdasarkan role atau permission.
-    Filter berdasarkan pengguna.
-    Aturan pagination dan sorting.
-    Penanganan record yang tidak ditemukan.
-    Pencegahan duplikasi.
-    Audit logging.
-    Aturan transaksi atau konsistensi data.

Jika aturan bisnis belum diterapkan atau belum dapat dibuktikan, tandai sebagai belum ditemukan. Jangan menyimpulkan bahwa validasi tersedia hanya karena seharusnya ada.

### I. Dependencies and External Integrations

Daftar dependensi yang berpengaruh terhadap perilaku module.

| Dependensi   | Fungsi              | Jenis            |
| ------------ | ------------------- | ---------------- |
| `accounts`   | Sesuai implementasi | Internal module  |
| `httpx`      | Sesuai implementasi | Shared package   |
| External API | Sesuai implementasi | External service |

Jelaskan apakah dependensi tersebut menyediakan data, menjalankan validasi, mencatat aktivitas, menghasilkan export, atau melakukan integrasi eksternal.

### J. Limitations and Data Gaps

Catat keterbatasan yang ditemukan, misalnya:

-    Data masih menggunakan mock atau sample.
-    Tabel atau migration belum ditemukan.
-    Status belum memiliki sumber data aktual.
-    Endpoint belum diimplementasikan.
-    Relasi tabel belum dapat diverifikasi.
-    Integrasi eksternal belum tersedia.
-    Dokumentasi kontrak API belum lengkap.

Pisahkan fakta dari rekomendasi. Jangan mengubah keterbatasan menjadi klaim bahwa fitur sudah berjalan.

### K. Source Code References

Cantumkan lokasi file dan simbol kode yang menjadi dasar dokumentasi.

Contoh:

-    Route registration: `internal/summary/feature.go` — `Feature.Routes`
-    Response schema: `internal/summary/feature.go` — `Summary`
-    Query atau sumber data: file dan fungsi yang benar-benar melakukan akses data
-    Database schema: file migration atau definisi tabel yang relevan

Gunakan path dan nama fungsi yang aktual. Jika memungkinkan, sertakan nomor baris yang sudah diverifikasi.

## 5. Cross-Module Documentation Index

Di `docs/modules/README.md`, buat tabel inventaris:

| Module   | Tujuan              | Endpoint utama | Tabel terkait | Dokumentasi                  |
| -------- | ------------------- | -------------- | ------------- | ---------------------------- |
| Summary  | Ringkasan aplikasi  | Sesuai route   | Sesuai query  | [summary.md](./summary.md)   |
| Accounts | Sesuai implementasi | Sesuai route   | Sesuai query  | [accounts.md](./accounts.md) |

Isi tabel berdasarkan hasil pemeriksaan repository, bukan berdasarkan contoh di atas.

Tambahkan ringkasan:

-    Jumlah module yang ditemukan dan didokumentasikan.
-    Module yang belum terdokumentasi.
-    Tabel database yang digunakan bersama oleh beberapa module.
-    Dependensi penting antarmodule.
-    Keterbatasan analisis yang masih ada.

Jika jumlah module banyak, buat inventaris secara bertahap dan pastikan setiap module memiliki status dokumentasi yang jelas.

## 6. Documentation Accuracy Rules

Aturan ini wajib dipatuhi:

1. Dokumentasikan implementasi aktual, bukan desain yang diharapkan.
2. Jangan mengarang tabel, kolom, endpoint, permission, atau response.
3. Jangan menyimpulkan foreign key hanya dari nama kolom.
4. Jangan menganggap seluruh data pada sebuah halaman berasal dari satu tabel.
5. Bedakan query langsung dengan akses data tidak langsung melalui module lain.
6. Jangan menyatakan endpoint aman atau memiliki otorisasi tanpa bukti kode.
7. Jika informasi tidak ditemukan, tulis secara eksplisit bahwa informasi tersebut belum dapat diverifikasi.
8. Jika beberapa sumber bertentangan, catat perbedaannya dan identifikasi sumber yang paling relevan.
9. Jangan mengubah kode aplikasi, schema database, atau kontrak API hanya demi melengkapi dokumentasi.
10. Jangan menambahkan contoh data sensitif atau kredensial ke file Markdown.
11. Gunakan bahasa Indonesia yang konsisten, ringkas, dan mudah dipahami.
12. Hindari dokumentasi generik yang hanya menjelaskan fungsi module tanpa menunjukkan asal data, tabel terkait, dan endpoint aktual.

## 7. Execution Workflow

Lakukan proses berikut secara berurutan:

1. Identifikasi scope module yang diminta.
2. Temukan route, handler, business logic, dan dependency terkait.
3. Telusuri akses database dan schema/migration yang tersedia.
4. Petakan tabel, kolom, relasi, serta operasi baca dan tulis.
5. Petakan endpoint, request, response, autentikasi, dan otorisasi.
6. Telusuri alur data dan aturan bisnis.
7. Tulis dokumentasi Markdown berdasarkan template.
8. Periksa seluruh klaim terhadap source code.
9. Periksa konsistensi link, nama file, dan struktur dokumentasi.
10. Perbarui index jika dokumentasi module baru dibuat.
11. Laporkan hasil dan informasi yang belum dapat diverifikasi.

Kerjakan dokumentasi satu module pada satu waktu. Jika diminta mendokumentasikan semua module, lanjutkan sampai inventaris selesai atau jelaskan dengan spesifik bagian yang belum selesai.

## 8. Final Report

Setelah selesai, laporkan dalam bahasa Indonesia:

-    Module yang didokumentasikan.
-    File Markdown yang dibuat atau diperbarui.
-    Endpoint yang berhasil dipetakan.
-    Tabel dan relasi yang berhasil diverifikasi.
-    Dependensi penting yang ditemukan.
-    Informasi yang belum dapat dipastikan.
-    Pemeriksaan konsistensi yang telah dilakukan.

Jangan menyatakan dokumentasi lengkap jika masih ada module atau alur penting yang belum diperiksa.
