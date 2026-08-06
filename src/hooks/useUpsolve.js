import { useState, useEffect, useCallback } from 'react';
import { fetchAllUnsolved } from '../utils/fetchers';

const HANDLES_KEY = 'au_handles';
const UPSOLVED_KEY = 'au_upsolved_ids';

const DEFAULT_HANDLES = { cf: '', lc: '', cc: '' };

function loadHandles() {
  try {
    return JSON.parse(localStorage.getItem(HANDLES_KEY)) || DEFAULT_HANDLES;
  } catch {
    return DEFAULT_HANDLES;
  }
}

function loadUpsolvedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(UPSOLVED_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveHandles(handles) {
  localStorage.setItem(HANDLES_KEY, JSON.stringify(handles));
}

function saveUpsolvedIds(ids) {
  localStorage.setItem(UPSOLVED_KEY, JSON.stringify([...ids]));
}

/**
 * Core hook for Auto-Upsolve state management.
 */
export function useUpsolve() {
  const [handles, setHandlesState] = useState(loadHandles);
  const [upsolvedIds, setUpsolvedIds] = useState(loadUpsolvedIds);
  const [rawProblems, setRawProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState('all'); // 'all' | 'codeforces' | 'leetcode' | 'codechef'
  const [hideCompleted, setHideCompleted] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Persist handles to localStorage whenever they change
  const setHandles = useCallback((newHandles) => {
    setHandlesState(newHandles);
    saveHandles(newHandles);
  }, []);

  // Mark a problem as upsolved
  const markUpsolved = useCallback(
    (problemId) => {
      setUpsolvedIds((prev) => {
        const next = new Set(prev);
        next.add(problemId);
        saveUpsolvedIds(next);
        return next;
      });
    },
    []
  );

  // Unmark a problem (remove from upsolved)
  const unmarkUpsolved = useCallback((problemId) => {
    setUpsolvedIds((prev) => {
      const next = new Set(prev);
      next.delete(problemId);
      saveUpsolvedIds(next);
      return next;
    });
  }, []);

  // Merge upsolved state into problems
  const problems = rawProblems.map((p) => ({
    ...p,
    status: upsolvedIds.has(p.id) ? 'upsolved' : 'unsolved',
  }));

  // Filtered view
  const visibleProblems = problems.filter((p) => {
    if (filter !== 'all' && p.platform !== filter) return false;
    if (hideCompleted && p.status === 'upsolved') return false;
    return true;
  });

  // Sync / fetch
  const sync = useCallback(async () => {
    const { cf, lc, cc } = handles;
    if (!cf && !lc && !cc) return;

    setLoading(true);
    setErrors({});

    try {
      const { problems: fetched, errors: fetchErrors } = await fetchAllUnsolved(cf, lc, cc);
      setRawProblems(fetched);
      setErrors(fetchErrors);
      setLastSync(new Date());
    } catch (err) {
      console.error('Sync error:', err);
      setErrors({ global: err.message });
    } finally {
      setLoading(false);
    }
  }, [handles]);

  // Auto-sync on mount if handles are saved
  useEffect(() => {
    const { cf, lc, cc } = handles;
    if (cf || lc || cc) {
      sync();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = {
    total: problems.length,
    upsolved: problems.filter((p) => p.status === 'upsolved').length,
    byPlatform: {
      codeforces: problems.filter((p) => p.platform === 'codeforces').length,
      leetcode: problems.filter((p) => p.platform === 'leetcode').length,
      codechef: problems.filter((p) => p.platform === 'codechef').length,
    },
  };

  return {
    handles,
    setHandles,
    problems,
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
  };
}
