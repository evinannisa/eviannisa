/* ISI DULU SEBELUM DIPAKAI.

   Repo ini belum memiliki data pendidikan, jadi nilai di bawah sengaja berupa
   placeholder yang jelas ("20XX", "Nama kampus") agar tidak dikira data asli.
   Ganti isinya di sini, karena komponen EducationTimeline membacanya langsung.

   `note` bersifat opsional. Jika kosong, barisnya tidak dirender. */
export type Education = {
  period: string;
  degree: string;
  school: string;
  note?: string;
};

export const education: Education[] = [
  {
    period: "20XX - 20XX",
    degree: "Program studi",
    school: "Nama kampus",
    note: "Coursework and an internship program",
  },
];
