import Link from "next/link";

export default function EndPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-center flex-col space-y-12">
      <div className="absolute inset-0 -z-30">
        <div
          className="w-full h-full bg-cover bg-center midnight"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dpnzmcban/image/upload/v1768177737/IMG_7222_aiwfpo.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/80 to-black/80 backdrop-blur-[2px]" />
      </div>
      <div className="max-w-md space-y-8">
        <h2 className="text-3xl font-serif font-semibold">
          Closing the Sanctuary
        </h2>
        <p className="text-neutral-300 font-semibold  text-center p-4">
          Look at your partner. Say one promise you want to keep for us.
        </p>
        <p className="text-xs text-neutral-500">
          Thank you for choosing presence.
        </p>
      </div>
      <div>
        <button
          className="text-sm text-[#B11226]
    border border-[#B11226]
    px-4 py-3 rounded-full
    cursor-pointer
    pointer-events-auto
    hover:bg-[#B11226] hover:text-red-50
    transition-all hover:font-semibold font-medium"
        >
          <Link href="/">Return to Home</Link>
        </button>
      </div>
    </main>
  );
}
