import { WallCalendar } from "@/components/WallCalendar";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-[min(100%-18px,920px)] items-center justify-center py-4 md:w-[min(100%-24px,920px)] md:py-6">
      <WallCalendar />
    </main>
  );
}
