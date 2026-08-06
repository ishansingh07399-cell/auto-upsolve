import { Settings, RefreshCw, Code2, Terminal } from 'lucide-react';

export default function EmptyState({ hasHandles, onOpenSettings, onSync }) {
  if (!hasHandles) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in">
        {/* Decorative terminal icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 flex items-center justify-center">
            <Terminal className="w-10 h-10 text-violet-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-zinc-500" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-zinc-100 mb-2">
          Welcome to <span className="text-gradient">Auto-Upsolve</span>
        </h2>
        <p className="text-sm text-zinc-500 max-w-sm leading-relaxed mb-8">
          Connect your competitive programming accounts to automatically fetch and track
          problems you've attempted but haven't solved yet.
        </p>

        {/* Platform pills */}
        <div className="flex items-center gap-3 mb-8 flex-wrap justify-center">
          {[
            { name: 'Codeforces', color: '#e8334a' },
            { name: 'LeetCode', color: '#ffa116' },
            { name: 'CodeChef', color: '#8B6448' },
          ].map(({ name, color }) => (
            <div
              key={name}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium"
              style={{ borderColor: color + '40', color, backgroundColor: color + '10' }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              {name}
            </div>
          ))}
        </div>

        <button
          id="empty-setup-button"
          onClick={onOpenSettings}
          className="btn-primary text-sm px-6 py-2.5"
        >
          <Settings className="w-4 h-4" />
          Set Up Your Handles
        </button>
      </div>
    );
  }

  // Has handles but no problems found
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-emerald-950/30 border border-emerald-800/30 flex items-center justify-center mb-6">
        <span className="text-4xl">🎉</span>
      </div>
      <h2 className="text-xl font-bold text-zinc-100 mb-2">All caught up!</h2>
      <p className="text-sm text-zinc-500 max-w-xs leading-relaxed mb-6">
        No unsolved problems found. Either you've solved everything, or your current
        filter is hiding them.
      </p>
      <button
        id="empty-sync-button"
        onClick={onSync}
        className="btn-ghost"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>
    </div>
  );
}
