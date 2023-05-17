import Image from "next/image";
import { Inter } from "next/font/google";
import { YouTubeForm } from "@/components/YoutubeForm";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="w-full  flex flex-col justify-center items-center bg-slate-900 text-white">
      <YouTubeForm />
    </main>
  );
}
