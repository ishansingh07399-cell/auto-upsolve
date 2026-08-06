import { EyeOff, Eye, SlidersHorizontal } from 'lucide-react';

const PLATFORMS = [
  { id: 'all', label: 'All' },
  { id: 'codeforces', label: 'Codeforces', color: '#e8334a' },
  { id: 'leetcode', label: 'LeetCode', color: '#ffa116' },
  { id: 'codechef', label: 'CodeChef', color: '#8B6448' },
];

export default function FilterBar({
  filter,
  onFilterChange,
  hideCompleted,
  onToggleHideCompleted,
  stats,
  visibleCount,
  errors,
}) {
  return (
    <div className="space-y-3">
      {/* Error banners */}
      {Object.entries(errors).map(([platform, msg]) => (
        <div
          key={platform}
          className="flex items-start gap-2 px-4 py-2.5 rounded-lg bg-red-950/40 border border-red-800/40 text-xs text-red-300"
        >
          <span className="font-semibold capitalize">{platform}:</span>
          <span className="text-red-400/80">{msg}</span>
        </div>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Platform filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 mr-0.5 flex-shrink-0" />
          {PLATFORMS.map(({ id, label, color }) => {
            const isActive = filter === id;
            const count = id === 'all' ? stats.total : stats.byPlatform[id] || 0;

            return (
              <button
                key={id}
                id={`filter-${id}`}
                onClick={() => onFilterChange(id)}
                className={`
                  relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  transition-all duration-200 border
                  ${isActive
                    ? 'text-white border-transparent shadow-sm'
                    : 'text-zinc-400 border-zinc-800/60 hover:border-zinc-700 hover:text-zinc-200 bg-zinc-900/40'
                  }
                `}
                style={
                  isActive && color
                    ? {
                        backgroundColor: color + '25',
                        borderColor: color + '60',
                        color: color,
                      }
                    : isActive
                    ? { backgroundColor: '#6d28d9', borderColor: '#7c3aed' }
                    : {}
                }
              >
                {color && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                )}
                {label}
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/15' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {visibleCount > 0 && (
            <span className="text-xs text-zinc-500 font-mono">
              Showing <span className="text-zinc-300">{visibleCount}</span> problems
            </span>
          )}
          <button
            id="toggle-completed"
            onClick={onToggleHideCompleted}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              border transition-all duration-200
              ${hideCompleted
                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30'
                : 'text-zinc-400 border-zinc-800/60 hover:border-zinc-700 hover:text-zinc-200 bg-zinc-900/40'
              }`}
          >
            {hideCompleted ? (
              <EyeOff className="w-3 h-3" />
            ) : (
              <Eye className="w-3 h-3" />
            )}
            {hideCompleted ? 'Showing Unsolved' : 'Hide Completed'}
          </button>
        </div>
      </div>
    </div>
  );
}
