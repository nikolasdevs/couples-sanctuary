export default function PauseOverlay({ onResume }: { onResume: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="text-center space-y-6 px-6">
        <h2 className="text-2xl font-serif">Pause</h2>
        <p className="text-neutral-400">Take a breath. Stay where you are.</p>
        <button
          onClick={onResume}
          className="border border-amber-400 px-6 py-3 rounded-full text-amber-400"
        >
          Resume
        </button>
      </div>
    </div>
  );
}
