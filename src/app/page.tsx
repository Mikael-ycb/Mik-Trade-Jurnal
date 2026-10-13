import { Button } from "@/components/ui/button";
import { NotebookPenIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black">
      <NotebookPenIcon className="text-fuchsia-500 size-10" />
      <h1 className="text-blue-500 text-2xl font-bold">Welcome to Miternal</h1>
      <p className="text-blue-500 mt-2 text-lg">
        Your personal Mik Jurnal for Trading
      </p>
      <Link href="/dashboard">
        <Button className="mt-2" size="lg">
          Lets Started
        </Button>
      </Link>
    </main>
  );
}
