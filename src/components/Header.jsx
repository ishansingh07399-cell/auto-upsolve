import { RefreshCw, Settings, Terminal, Zap } from 'lucide-react';

function formatLastSync(date) {
  if (!date) return null;
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return date.toLocaleTimeString();
}

export default function Header({ loading, onSync, onOpenSettings, handles, lastSync, stats }) {
  const hasHandles = handles.cf || handles.lc || handles.cc;

  return (
    <header className="sticky top-0 z-30 glass-dark border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-zinc-950 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient leading-none">Auto-Upsolve</h1>
              <p className="text-[10px] text-zinc-500 font-mono leading-none mt-0.5">
                CP Problem Tracker
              </p>
            </div>
          </div>

          {/* Center stats (desktop) */}
          {stats.total > 0 && (
            <div className="hidden md:flex items-center gap-6">
              <Stat label="Total" value={stats.total} color="text-zinc-300" />
              <div className="w-px h-6 bg-zinc-800" />
              <Stat label="Upsolved" value={stats.upsolved} color="text-emerald-400" />
              <div className="w-px h-6 bg-zinc-800" />
              <Stat label="Remaining" value={stats.total - stats.upsolved} color="text-amber-400" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {lastSync && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                <Zap className="w-3 h-3 text-emerald-500" />
                {formatLastSync(lastSync)}
              </span>
            )}

            <button
              id="sync-button"
              onClick={onSync}
              disabled={loading || !hasHandles}
              className="btn-primary relative overflow-hidden"
              title={!hasHandles ? 'Set your handles first' : 'Sync problems'}
            >
              <RefreshCw
                className={`w-4 h-4 transition-transform ${loading ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline">{loading ? 'Syncing...' : 'Sync'}</span>
              {loading && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
              )}
            </button>

            <button
              id="settings-button"
              onClick={onOpenSettings}
              className="btn-ghost"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="text-center">
      <div className={`text-xl font-bold font-mono ${color}`}>{value}</div>
      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}
