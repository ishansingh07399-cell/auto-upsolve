export default function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="flex flex-col gap-3">
        {/* Top badges */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 bg-zinc-800 rounded-full" />
          <div className="h-5 w-16 bg-zinc-800 rounded-full" />
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <div className="h-4 w-4/5 bg-zinc-800 rounded" />
          <div className="h-4 w-2/5 bg-zinc-800/60 rounded" />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5">
          <div className="h-4 w-12 bg-zinc-800/50 rounded" />
          <div className="h-4 w-16 bg-zinc-800/50 rounded" />
          <div className="h-4 w-10 bg-zinc-800/50 rounded" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40">
          <div className="h-3 w-28 bg-zinc-800/50 rounded" />
          <div className="h-6 w-28 bg-zinc-800 rounded-md" />
        </div>
      </div>
    </div>
  );
}
