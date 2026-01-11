export default function Progress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="w-full bg-neutral-800 h-1 rounded-full">
      <div
        className="bg-amber-400 h-1 rounded-full transition-all"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  );
}
