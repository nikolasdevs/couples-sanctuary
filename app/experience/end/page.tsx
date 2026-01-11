import Link from "next/link";

export default function EndPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center flex-col space-y-12">
      <div className="max-w-md space-y-8">
        <h2 className="text-3xl font-serif">Closing the Sanctuary</h2>
        <p className="text-neutral-300">
          Look at your partner. Say one promise you want to keep for us.
        </p>
        <p className="text-xs text-neutral-500">
          Thank you for choosing presence.
        </p>
      </div>
      <div>
        <button className=" bg-amber-400 px-6 py-2 rounded-full text-black font-medium">
          <Link href="/">Return to Home</Link>
        </button>
      </div>
    </main>
  );
}
