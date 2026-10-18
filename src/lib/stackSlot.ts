/* Aturan jumlah entri stack yang tampil per lebar layar, dipakai oleh
   WorkHighlight dan ProjectsHighlight: 2 di bawah sm, 3 di sm, dan 5 mulai md.

   Riwayatnya: 1/2/5 -> 2/2/5 (tingkat sm sempat dihapus karena tidak lagi
   berbeda) -> 2/3/5, sehingga tingkat sm dipakai lagi.

   Aturannya disimpan di satu tempat karena sama untuk kedua daftar. Jika disalin,
   perubahan angka harus dilakukan di dua file dan salah satunya mudah terlewat.

   Jumlah entri diatur dengan class responsif, bukan dengan memotong array di JS.
   Jumlah yang dirender di server harus sama dengan di client, sedangkan lebar
   jendela baru diketahui SETELAH hydration. Semua entri tetap ada di DOM, hanya
   `display`-nya yang berubah.

   Nama class ditulis UTUH sebagai literal, bukan dirangkai seperti
   `hidden md:${display}`. Tailwind memindai nama class apa adanya di file sumber,
   jadi class yang dirangkai saat runtime tidak ikut dihasilkan dan tidak berefek.
   Versi pertama helper ini memakai template string, dan `md:flex` memang hilang
   dari CSS hasil build.

   Urutan indeks: [selalu, mulai sm, mulai md]. */
const SLOT = {
  flex: ["flex", "hidden sm:flex", "hidden md:flex"],
  "inline-flex": ["inline-flex", "hidden sm:inline-flex", "hidden md:inline-flex"],
} as const;

/* Batas 5 ditulis eksplisit meskipun kedua daftar saat ini tepat berisi 5 entri.
   Tanpa batas ini, entri ke-6 yang ditambahkan nanti akan ikut tampil di md. */
export function stackSlot(i: number, display: keyof typeof SLOT = "flex") {
  if (i >= 5) return "hidden";
  const s = SLOT[display];
  if (i >= 4) return s[2]; // Entri ke-4 dan ke-5: hanya mulai md.
  if (i >= 2) return s[1]; // Entri ke-3: mulai tampil di sm.
  return s[0]; // Dua entri pertama: selalu tampil.
}
