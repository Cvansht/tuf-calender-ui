import { WallCalendar } from "@/components/WallCalendar";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-[min(100%-16px,920px)] items-center justify-center py-2 md:w-[min(100%-20px,920px)] md:py-3">
      <WallCalendar />
    </main>
  );
}
