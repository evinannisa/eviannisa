import { NextResponse } from "next/server";
import { asc, count, desc, gt, lte, min } from "drizzle-orm";
import { db } from "../../../db";
import { capsules } from "../../../db/schema";

// Tanggal buka dipilih pengunjung, tetapi batasnya dicek di server:
// paling cepat besok, paling lama MAX_YEARS tahun lagi.
const MAX_YEARS = 10;
const MAX_NAME = 40;
const MAX_MESSAGE = 500;

export async function GET() {
  try {
    const now = new Date();
    const [sealed] = await db
      .select({ total: count(), nextOpen: min(capsules.openAt) })
      .from(capsules)
      .where(gt(capsules.openAt, now));
    const opened = await db
      .select({
        id: capsules.id,
        name: capsules.name,
        message: capsules.message,
        openAt: capsules.openAt,
        createdAt: capsules.createdAt,
      })
      .from(capsules)
      .where(lte(capsules.openAt, now))
      .orderBy(desc(capsules.openAt), asc(capsules.id))
      .limit(20);

    return NextResponse.json({ sealed: sealed.total, nextOpen: sealed.nextOpen, opened });
  } catch (error: any) {
    console.error("Error fetching capsules:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Field honeypot: disembunyikan dari pengunjung, jadi biasanya hanya diisi bot.
    if (body.website) return NextResponse.json({ ok: true });

    const name =
      String(body.name ?? "")
        .trim()
        .slice(0, MAX_NAME) || "anonymous";
    const message = String(body.message ?? "").trim();
    const openAt = parseDate(body.openAt);

    if (!message || message.length > MAX_MESSAGE) {
      return NextResponse.json(
        { error: `Message must be 1-${MAX_MESSAGE} characters` },
        { status: 400 },
      );
    }
    if (!openAt) {
      return NextResponse.json({ error: "Pick a valid opening date" }, { status: 400 });
    }
    const earliest = startOfTodayUTC();
    earliest.setUTCDate(earliest.getUTCDate() + 1);
    const latest = startOfTodayUTC();
    latest.setUTCFullYear(latest.getUTCFullYear() + MAX_YEARS);
    if (openAt < earliest || openAt > latest) {
      return NextResponse.json(
        { error: `The opening date must be between tomorrow and ${MAX_YEARS} years from now` },
        { status: 400 },
      );
    }

    const [inserted] = await db
      .insert(capsules)
      .values({ name, message, openAt })
      .returning({ id: capsules.id, openAt: capsules.openAt });

    return NextResponse.json({ data: inserted });
  } catch (error: any) {
    console.error("Error saving capsule:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const startOfTodayUTC = () => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// Menerima "YYYY-MM-DD" dari input tanggal dan menyimpannya sebagai tengah malam UTC
function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00Z`);
  // Menolak tanggal yang tidak valid, misalnya 2027-02-30 yang digeser Date ke Maret.
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value ? null : d;
}
