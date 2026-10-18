import { NextResponse } from "next/server";

const USER = "eviannisaa";

/* Data di-cache satu jam di server. Ini wajib, bukan sekadar optimasi: Search API
   GitHub tanpa token hanya mengizinkan 10 request per menit per IP. Jika setiap
   pengunjung memanggilnya dari browser, kuota cepat habis dan semua angka gagal
   tampil. Dengan revalidate, GitHub dipanggil paling banyak sekali per jam,
   berapa pun jumlah pengunjungnya. */
export const revalidate = 3600;

const HEADERS = {
  "User-Agent": `${USER}-portfolio`,
  Accept: "application/vnd.github+json",
};

async function num(url: string, pick: (j: Record<string, unknown>) => unknown) {
  try {
    const r = await fetch(url, { headers: HEADERS, next: { revalidate } });
    if (!r.ok) return null;
    const v = pick(await r.json());
    return typeof v === "number" ? v : null;
  } catch {
    return null;
  }
}

/* Grafik kontribusi tidak tersedia di REST API GitHub, hanya di GraphQL yang
   membutuhkan token. Halaman /users/<user>/contributions bersifat publik tanpa
   auth, tetapi yang dibaca adalah HTML, sehingga bisa rusak jika GitHub mengubah
   markup-nya. Karena itu kegagalannya ditangani dengan aman: `days` dikosongkan,
   panel menyembunyikan grafik, dan angka lain tetap tampil. */
async function contributions() {
  try {
    const r = await fetch(`https://github.com/users/${USER}/contributions`, {
      headers: { "User-Agent": `${USER}-portfolio` },
      next: { revalidate },
    });
    if (!r.ok) return { days: [], total: null };
    const html = await r.text();

    const days = [...html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g)].map(
      (m) => ({ d: m[1], l: Number(m[2]) }),
    );
    const t = html.match(/([\d,]+)\s+contributions?\s+in/);
    return { days, total: t ? Number(t[1].replace(/,/g, "")) : null };
  } catch {
    return { days: [], total: null };
  }
}

export async function GET() {
  const [repos, prs, commits, contrib] = await Promise.all([
    num(`https://api.github.com/users/${USER}`, (j) => j.public_repos),
    num(
      `https://api.github.com/search/issues?q=author:${USER}+type:pr&per_page=1`,
      (j) => j.total_count,
    ),
    num(`https://api.github.com/search/commits?q=author:${USER}&per_page=1`, (j) => j.total_count),
    contributions(),
  ]);

  return NextResponse.json({ user: USER, repos, prs, commits, ...contrib });
}
