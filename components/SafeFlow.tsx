export default function SafeFlow({
  onRedirect,
  onSkip,
  onEnd,
  onReconsider,
}: {
  onRedirect: () => void;
  onSkip: () => void;
  onEnd: () => void;
  onReconsider: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      <div className="max-w-md text-center space-y-6 px-6">
        <h2 className="text-2xl font-serif text-red-400">Safe Moment</h2>

        <p className="text-neutral-300">
          A boundary has been set. You don’t need to explain it.
        </p>

        <div className="space-y-3">
          <button
            onClick={onRedirect}
            className="w-full border border-neutral-600 py-3 rounded-xl hover:border-amber-400"
          >
            Change direction
          </button>

          <button
            onClick={onSkip}
            className="w-full border border-neutral-700 py-3 rounded-xl hover:border-amber-400"
          >
            Skip this card
          </button>
          <div className="flex items-center justify-center mt-10">
            {" "}
            <button
              onClick={onReconsider}
              className="w-full text-emerald-400 text-sm underline"
            >
              Cancel / Reconsider
            </button>
            <button
              onClick={onEnd}
              className="w-full text-red-400 text-sm underline"
            >
              End session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
