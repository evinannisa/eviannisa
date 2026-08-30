import { JsonBlock, type JsonRow } from "@/components/JsonBlock";

/* Barisnya diterima apa adanya dari page.tsx supaya `jsDoc` tetap satu sumber
   data, lalu `* @tag nilai` diurai jadi pasangan kunci/nilai. Kerangka komentar
   dibuang karena bentuk yang diminta JSON, bukan JSDoc.

   Nilai yang isinya lebih dari satu hal dipisah "·" di sumbernya dan di sini
   dipecah jadi array. Aturannya ada pada pemisahnya, bukan pada nama kuncinya,
   jadi baris `@apa-pun` yang baru ditambahkan ke `jsDoc` otomatis ikut aturan
   yang sama tanpa menyentuh komponen ini. */
function parse(lines: string[]): JsonRow[] {
  const out: JsonRow[] = [];
  for (const line of lines) {
    const m = line.match(/^\s*\*\s*@(\w+)\s+(.*)$/);
    if (!m) continue;
    const parts = m[2]
      .split("·")
      .map((x) => x.trim())
      .filter(Boolean);
    out.push([m[1], parts.length > 1 ? parts : m[2].trim()]);
  }
  return out;
}

export function ProfileJson({ lines, className = "" }: { lines: string[]; className?: string }) {
  return <JsonBlock rows={parse(lines)} className={className} />;
}
