import { useState } from 'react';
import { useUpsolve } from './hooks/useUpsolve';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import FilterBar from './components/FilterBar';
import ProblemCard from './components/ProblemCard';
import SkeletonCard from './components/SkeletonCard';
import EmptyState from './components/EmptyState';

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    handles,
    setHandles,
    visibleProblems,
    loading,
    errors,
    filter,
    setFilter,
    hideCompleted,
    setHideCompleted,
    sync,
    markUpsolved,
    unmarkUpsolved,
    lastSync,
    stats,
  } = useUpsolve();

  const hasHandles = !!(handles.cf || handles.lc || handles.cc);

  const handleSaveSettings = (newHandles) => {
    setHandles(newHandles);
    // Trigger sync after a short delay so state updates first
    setTimeout(() => sync(), 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        loading={loading}
        onSync={sync}
        onOpenSettings={() => setSettingsOpen(true)}
        handles={handles}
        lastSync={lastSync}
        stats={stats}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section — shown only when no problems yet */}
        {!loading && stats.total === 0 && (
          <EmptyState
            hasHandles={hasHandles}
            onOpenSettings={() => setSettingsOpen(true)}
            onSync={sync}
          />
        )}

        {/* Main content */}
        {(loading || stats.total > 0) && (
          <div className="space-y-6">
            {/* Filter bar */}
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              hideCompleted={hideCompleted}
              onToggleHideCompleted={() => setHideCompleted((v) => !v)}
              stats={stats}
              visibleCount={visibleProblems.length}
              errors={errors}
            />

            {/* Progress bar */}
            {stats.total > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-mono">
                    {stats.upsolved}/{stats.total} upsolved
                  </span>
                  <span className="font-mono text-emerald-500">
                    {stats.total > 0
                      ? Math.round((stats.upsolved / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? (stats.upsolved / stats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Problem grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading
                ? Array.from({ length: 9 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : visibleProblems.map((problem) => (
                    <ProblemCard
                      key={problem.id}
                      problem={problem}
                      onMarkUpsolved={markUpsolved}
                      onUnmarkUpsolved={unmarkUpsolved}
                    />
                  ))}
            </div>

            {/* Empty filter result */}
            {!loading && visibleProblems.length === 0 && stats.total > 0 && (
              <div className="text-center py-12 text-zinc-500 text-sm">
                No problems match the current filter.{' '}
                <button
                  onClick={() => {
                    setFilter('all');
                    setHideCompleted(false);
                  }}
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600">
          <span className="font-mono">
            Auto-Upsolve — Your CP accountability tool
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://codeforces.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors"
            >
              Codeforces
            </a>
            <a
              href="https://leetcode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors"
            >
              LeetCode
            </a>
            <a
              href="https://codechef.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors"
            >
              CodeChef
            </a>
          </div>
        </div>
      </footer>

      {/* Settings modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        handles={handles}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
