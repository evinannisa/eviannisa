/* ISI DULU SEBELUM DIPAKAI.

   Nilai di bawah sengaja berupa placeholder yang jelas ("20XX", "Nama kampus")
   agar tidak dikira data asli. File ini belum dipakai, karena EducationTimeline
   saat ini menulis datanya langsung di dalam komponen.

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
