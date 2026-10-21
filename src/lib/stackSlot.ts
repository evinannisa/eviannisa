/* Aturan jumlah entri stack yang tampil per lebar layar, dipakai oleh
   WorkHighlight dan ProjectsHighlight: 2 di bawah sm, 4 di sm, dan 5 mulai md.

   Aturannya disimpan di satu tempat agar perubahan angka cukup dilakukan di satu
   file untuk kedua daftar.

   Jumlah entri per layar diatur dengan class responsif, bukan dengan memotong
   array di JS. Jumlah yang dirender di server harus sama dengan di client,
   sedangkan lebar jendela baru diketahui setelah hydration. Semua entri tetap
   ada di DOM, hanya `display`-nya yang berubah.

   Nama class ditulis utuh sebagai literal, bukan dirangkai seperti
   `hidden md:${display}`. Tailwind memindai nama class apa adanya di file sumber,
   jadi class yang dirangkai saat runtime tidak ikut dihasilkan.

   Urutan indeks: [selalu, mulai sm, mulai md]. */
const SLOT = {
  flex: ["flex", "hidden sm:flex", "hidden md:flex"],
  "inline-flex": ["inline-flex", "hidden sm:inline-flex", "hidden md:inline-flex"],
} as const;

/* Batas 5 ditulis eksplisit agar entri ke-6 dan seterusnya tidak ikut tampil di md. */
export function stackSlot(i: number, display: keyof typeof SLOT = "flex") {
  if (i >= 5) return "hidden";
  const s = SLOT[display];
  if (i >= 4) return s[2]; // Entri ke-5: hanya tampil mulai md.
  if (i >= 2) return s[1]; // Entri ke-3 dan ke-4: mulai tampil di sm.
  return s[0]; // Dua entri pertama selalu tampil.
}
