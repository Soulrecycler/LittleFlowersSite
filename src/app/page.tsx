/**
 * Main application entry point for the Little Flowers Playschool.
 * This is a Server Component that includes the interactive
 * ScrollStorySection client component.
 */
import ScrollStorySection from "@/components/ScrollStorySection";

export const metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-[#fafafa]">
      <ScrollStorySection />
    </main>
  );
}
