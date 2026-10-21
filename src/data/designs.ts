/* Data untuk DesignHighlight, yang saat ini tidak ditampilkan di halaman about.
   Isi `img` dengan path gambar di public/assets/designs/ (misalnya
   "/assets/designs/nama.png"). Selama masih kosong, kartu menampilkan bingkai
   sketsa berisi judul agar layout tetap rapi tanpa gambar rusak.

   `DESIGN_MORE` adalah tujuan link "see more". Ganti "#" dengan URL profil
   Behance yang dipakai di baris media sosial home. */
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
