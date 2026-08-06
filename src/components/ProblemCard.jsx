import { ExternalLink, CheckCircle2, RotateCcw, Tag, Zap } from 'lucide-react';

const PLATFORM_CONFIG = {
  codeforces: {
    label: 'Codeforces',
    color: '#e8334a',
    bgClass: 'platform-cf',
    badgeBg: 'bg-red-950/50 text-red-400 border-red-800/40',
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
        <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v9c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
      </svg>
    ),
  },
  leetcode: {
    label: 'LeetCode',
    color: '#ffa116',
    bgClass: 'platform-lc',
    badgeBg: 'bg-amber-950/50 text-amber-400 border-amber-800/40',
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
  },
  codechef: {
    label: 'CodeChef',
    color: '#8B6448',
    bgClass: 'platform-cc',
    badgeBg: 'bg-amber-950/30 text-amber-700 border-amber-900/40',
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
        <path d="M11.257.004C5.858.086.675 4.315.05 9.768c-.563 4.923 2.168 9.143 6.253 11.114.63.307 1.29.538 1.966.71a.5.5 0 0 0 .61-.49v-1.14a.5.5 0 0 0-.376-.484C5.24 18.65 2.93 15.636 3.05 12c.155-4.65 4.15-8.31 8.793-8.003 4.357.289 7.742 3.997 7.672 8.37-.056 3.55-2.375 6.576-5.596 7.56a.5.5 0 0 0-.375.484v1.14a.5.5 0 0 0 .61.49c4.36-1.09 7.72-4.87 7.846-9.452.162-5.91-4.606-10.67-10.743-10.585z" />
      </svg>
    ),
  },
};

const DIFFICULTY_CONFIG = {
  // Codeforces ratings
  easy: { label: 'Easy', cls: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40' },
  medium: { label: 'Medium', cls: 'bg-amber-950/50 text-amber-400 border-amber-800/40' },
  hard: { label: 'Hard', cls: 'bg-red-950/50 text-red-400 border-red-800/40' },
  Easy: { label: 'Easy', cls: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40' },
  Medium: { label: 'Medium', cls: 'bg-amber-950/50 text-amber-400 border-amber-800/40' },
  Hard: { label: 'Hard', cls: 'bg-red-950/50 text-red-400 border-red-800/40' },
};

function getDifficultyStyle(difficulty) {
  if (!difficulty) return null;
  if (DIFFICULTY_CONFIG[difficulty]) return DIFFICULTY_CONFIG[difficulty];
  // Codeforces numeric rating
  const num = parseInt(difficulty, 10);
  if (!isNaN(num)) {
    if (num <= 1200) return { label: difficulty, cls: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40' };
    if (num <= 1800) return { label: difficulty, cls: 'bg-amber-950/50 text-amber-400 border-amber-800/40' };
    if (num <= 2400) return { label: difficulty, cls: 'bg-orange-950/50 text-orange-400 border-orange-800/40' };
    return { label: difficulty, cls: 'bg-red-950/50 text-red-400 border-red-800/40' };
  }
  return { label: difficulty, cls: 'bg-zinc-800/50 text-zinc-400 border-zinc-700/40' };
}

export default function ProblemCard({ problem, onMarkUpsolved, onUnmarkUpsolved }) {
  const platform = PLATFORM_CONFIG[problem.platform];
  const isUpsolved = problem.status === 'upsolved';
  const diffStyle = getDifficultyStyle(problem.difficulty);

  return (
    <article
      className={`card animate-slide-up group relative overflow-hidden
        ${isUpsolved ? 'platform-upsolved opacity-70 hover:opacity-100' : platform.bgClass}
      `}
    >
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
        style={{
          background: `radial-gradient(circle at 0% 50%, ${isUpsolved ? '#10b981' : platform.color}08 0%, transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col gap-3">
        {/* Top row: platform badge + upsolved badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Platform badge */}
            <span
              className={`badge border ${platform.badgeBg}`}
              style={{ gap: '4px' }}
            >
              {platform.icon}
              {platform.label}
            </span>

            {/* Difficulty badge */}
            {diffStyle && (
              <span className={`badge border ${diffStyle.cls}`}>
                <Zap className="w-2.5 h-2.5" />
                {diffStyle.label}
              </span>
            )}
          </div>

          {/* Upsolved indicator */}
          {isUpsolved && (
            <span className="badge border bg-emerald-950/50 text-emerald-400 border-emerald-800/40 flex-shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              Upsolved
            </span>
          )}
        </div>

        {/* Problem name */}
        <div className="flex items-start justify-between gap-3">
          <h3 className={`text-sm font-semibold leading-snug flex-1 ${isUpsolved ? 'text-zinc-400 line-through decoration-emerald-600/40' : 'text-zinc-100'}`}>
            {problem.name}
          </h3>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            id={`open-${problem.id.replace(/[^a-zA-Z0-9]/g, '-')}`}
            className="flex-shrink-0 p-1.5 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/50 transition-all"
            title="Open problem"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Tags (Codeforces) */}
        {problem.tags && problem.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <Tag className="w-3 h-3 text-zinc-600 flex-shrink-0" />
            {problem.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[10px] text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
            {problem.tags.length > 4 && (
              <span className="text-[10px] text-zinc-600">+{problem.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40">
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 font-mono truncate hover:text-zinc-400 transition-colors max-w-[60%]"
          >
            {new URL(problem.url).hostname}
          </a>

          {isUpsolved ? (
            <button
              id={`unmark-${problem.id.replace(/[^a-zA-Z0-9]/g, '-')}`}
              onClick={() => onUnmarkUpsolved(problem.id)}
              className="btn-ghost !py-1 !px-2 !text-xs text-zinc-500"
            >
              <RotateCcw className="w-3 h-3" />
              Undo
            </button>
          ) : (
            <button
              id={`mark-${problem.id.replace(/[^a-zA-Z0-9]/g, '-')}`}
              onClick={() => onMarkUpsolved(problem.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium
                text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-transparent
                hover:border-emerald-800/40 transition-all duration-200 active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Upsolved
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
