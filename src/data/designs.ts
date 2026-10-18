/* Ini satu-satunya bagian halaman about yang datanya belum ada di repo, karena
   belum ada file desain di public/. Isi `img` dengan path gambar di
   public/assets/designs/ (misalnya "/assets/designs/nama.png"). Selama masih
   kosong, kartu menampilkan bingkai sketsa berisi judul, sehingga tata letak
   tetap rapi tanpa gambar rusak.

   `DESIGN_MORE` adalah tujuan tautan "see more". Behance sudah disebut di
   baris media sosial home, tetapi handle-nya belum ada di repo. Ganti "#"
   dengan URL profilnya. */
export const DESIGN_MORE = "#";

export type Design = {
  title: string;
  note: string;
  img?: string;
  href?: string;
};

export const designs: Design[] = [
  {
    title: "Dashboard study",
    note: "layout · spacing · type scale",
  },
  {
    title: "Mobile flow",
    note: "onboarding · empty states",
  },
];
