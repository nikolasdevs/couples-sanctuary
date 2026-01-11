export default function SafeConfirm({
  onConfirm,
  onCancel,
  onReconsider,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  onReconsider: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      <div className="max-w-md text-center space-y-6 px-6">
        <h2 className="text-2xl font-serif">Before continuing</h2>

        <p className="text-neutral-300 leading-relaxed">
          You paused for safety. Are you both comfortable continuing now?
        </p>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full border border-amber-400 py-3 rounded-xl text-amber-300"
          >
            We’re okay to continue
          </button>

          <button
            onClick={onCancel}
            className="w-full text-neutral-400 text-sm underline"
          >
            Choose another direction
          </button>
        </div>
      </div>
    </div>
  );
}
