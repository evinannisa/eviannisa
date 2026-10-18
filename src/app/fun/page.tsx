import { PcBuilder } from "@/components/PcBuilder";

// Game tangkap serangga (src/components/BugCatcher.tsx) belum ditampilkan.
// Ganti <PcBuilder /> dengan <BugCatcher /> untuk menampilkannya.
export default function Fun() {
  return (
    <div className="relative mt-8 bg-background min-h-screen">
      <div className="px-6 pt-12 pb-6 max-w-5xl mx-auto">
        <h1 className="font-caveat text-[clamp(2rem,4vw,2.8rem)] font-bold text-foreground m-0">
          Just for Fun
        </h1>
        <p className="lg:max-w-160 text-xs sm:text-sm text-muted leading-[1.8] font-poppins-sans tracking-[0.012em]">
          I spend my days building software, so here&apos;s a chance to build the machine it runs
          on, one part at a time.
        </p>
      </div>

      <div className="px-6 pb-20 max-w-5xl mx-auto">
        <PcBuilder />
      </div>
    </div>
  );
}
