/**
 * Fetches all unsolved/attempted problems from Codeforces, LeetCode, and CodeChef in parallel.
 * Returns a unified Problem[] array.
 */

const CF_API = 'https://codeforces.com/api/user.status';
const LC_API = 'https://alfa-leetcode-api.onrender.com';
const CC_PROXY = '/api/codechef';

/**
 * Generates a stable unique ID for a problem.
 */
function makeId(platform, key) {
  return `${platform}::${key}`;
}

/**
 * Fetches unsolved Codeforces problems for a handle.
 * @param {string} handle
 * @returns {Promise<Problem[]>}
 */
async function fetchCodeforces(handle) {
  if (!handle) return [];

  const res = await fetch(`${CF_API}?handle=${encodeURIComponent(handle)}&from=1&count=500`);
  if (!res.ok) throw new Error(`Codeforces API error: ${res.status}`);
  const data = await res.json();

  if (data.status !== 'OK') {
    throw new Error(data.comment || 'Codeforces API returned non-OK status');
  }

  const submissions = data.result;

  // Build set of fully-solved problem keys
  const solvedKeys = new Set();
  for (const sub of submissions) {
    if (sub.verdict === 'OK') {
      const key = `${sub.problem.contestId}-${sub.problem.index}`;
      solvedKeys.add(key);
    }
  }

  // Collect unsolved submissions, deduplicated by problem key
  const seen = new Set();
  const unsolved = [];

  for (const sub of submissions) {
    if (sub.verdict === 'OK') continue;
    const key = `${sub.problem.contestId}-${sub.problem.index}`;
    if (solvedKeys.has(key)) continue; // later solved it
    if (seen.has(key)) continue;
    seen.add(key);

    const { contestId, index, name, rating, tags } = sub.problem;
    unsolved.push({
      id: makeId('codeforces', key),
      platform: 'codeforces',
      name: name || `${contestId}${index}`,
      url: `https://codeforces.com/contest/${contestId}/problem/${index}`,
      difficulty: rating ? String(rating) : null,
      tags: tags || [],
      status: 'unsolved',
    });
  }

  return unsolved;
}

/**
 * Fetches unsolved LeetCode problems for a username.
 * @param {string} username
 * @returns {Promise<Problem[]>}
 */
async function fetchLeetCode(username) {
  if (!username) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout for cold starts

  try {
    const res = await fetch(`${LC_API}/${encodeURIComponent(username)}/submission`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`);
    const data = await res.json();

    const submissions = Array.isArray(data.submission) ? data.submission : [];

    // Build set of accepted title slugs
    const acceptedSlugs = new Set();
    for (const sub of submissions) {
      if (sub.statusDisplay === 'Accepted') {
        acceptedSlugs.add(sub.titleSlug);
      }
    }

    // Deduplicate non-accepted by titleSlug
    const seen = new Set();
    const unsolved = [];

    for (const sub of submissions) {
      if (sub.statusDisplay === 'Accepted') continue;
      if (acceptedSlugs.has(sub.titleSlug)) continue; // later solved
      if (seen.has(sub.titleSlug)) continue;
      seen.add(sub.titleSlug);

      unsolved.push({
        id: makeId('leetcode', sub.titleSlug),
        platform: 'leetcode',
        name: sub.title || sub.titleSlug,
        url: `https://leetcode.com/problems/${sub.titleSlug}/`,
        difficulty: sub.difficulty || null,
        tags: [],
        status: 'unsolved',
      });
    }

    return unsolved;
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      console.warn('LeetCode API timed out — skipping');
      return [];
    }
    throw err;
  }
}

/**
 * Fetches attempted-but-not-solved CodeChef problems via the local Vercel proxy.
 * @param {string} handle
 * @returns {Promise<Problem[]>}
 */
async function fetchCodeChef(handle) {
  if (!handle) return [];

  const res = await fetch(`${CC_PROXY}?handle=${encodeURIComponent(handle)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `CodeChef proxy error: ${res.status}`);
  }
  const data = await res.json();

  return data.map((item) => ({
    id: makeId('codechef', item.problemId),
    platform: 'codechef',
    name: item.name || item.problemId,
    url: item.url,
    difficulty: item.difficulty || null,
    tags: [],
    status: 'unsolved',
  }));
}

/**
 * Main unified fetcher — runs all three in parallel.
 * Each platform fails independently; errors are reported per-platform.
 *
 * @param {string} cfHandle
 * @param {string} lcHandle
 * @param {string} ccHandle
 * @returns {Promise<{ problems: Problem[], errors: Record<string, string> }>}
 */
export async function fetchAllUnsolved(cfHandle, lcHandle, ccHandle) {
  const [cfResult, lcResult, ccResult] = await Promise.allSettled([
    fetchCodeforces(cfHandle),
    fetchLeetCode(lcHandle),
    fetchCodeChef(ccHandle),
  ]);

  const problems = [];
  const errors = {};

  if (cfResult.status === 'fulfilled') {
    problems.push(...cfResult.value);
  } else {
    errors.codeforces = cfResult.reason?.message || 'Unknown error';
    console.error('Codeforces fetch error:', cfResult.reason);
  }

  if (lcResult.status === 'fulfilled') {
    problems.push(...lcResult.value);
  } else {
    errors.leetcode = lcResult.reason?.message || 'Unknown error';
    console.error('LeetCode fetch error:', lcResult.reason);
  }

  if (ccResult.status === 'fulfilled') {
    problems.push(...ccResult.value);
  } else {
    errors.codechef = ccResult.reason?.message || 'Unknown error';
    console.error('CodeChef fetch error:', ccResult.reason);
  }

  return { problems, errors };
}
