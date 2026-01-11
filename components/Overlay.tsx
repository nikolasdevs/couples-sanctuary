export default function Overlay({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="max-w-md text-center space-y-6 px-6">
        <h2 className="text-2xl font-serif">{title}</h2>
        <p className="text-neutral-300">{message}</p>
        <button
          onClick={onClose}
          className="border border-amber-400 px-6 py-2 rounded-full text-amber-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
