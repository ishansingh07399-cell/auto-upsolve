import axios from 'axios';
import { load } from 'cheerio';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { handle } = req.query;
  if (!handle) {
    return res.status(400).json({ error: 'Missing handle parameter' });
  }

  const axiosConfig = {
    timeout: 12000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'application/json, text/plain, */*',
      Referer: `https://www.codechef.com/users/${handle}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
  };

  try {
    // -------------------------------------------------------------------
    // CodeChef's profile page is Cloudflare-protected (returns JS challenge).
    // We use the internal /recent/user API instead — not bot-protected.
    // It returns paginated HTML tables of submissions.
    // Verdict is in the `title` attribute of a <span> in column 3.
    // -------------------------------------------------------------------
    const MAX_PAGES = 10;
    const solvedSet = new Set();    // problem codes that got AC
    const attemptedMap = new Map(); // code -> { name, url }

    for (let page = 0; page < MAX_PAGES; page++) {
      const url = `https://www.codechef.com/recent/user?user_handle=${encodeURIComponent(handle)}&page=${page}`;
      let data;

      try {
        const resp = await axios.get(url, axiosConfig);
        data = resp.data;
      } catch (err) {
        break;
      }

      const html = typeof data === 'string' ? data : (data.content || '');

      // No activity on page 0 → user not found / no submissions
      if (page === 0 && html.includes('No Recent Activity')) {
        return res.status(404).json({
          error: `CodeChef user "${handle}" not found or has no submissions.`,
        });
      }

      if (!html || html.trim() === '') break;

      const $ = load(html);
      let rowsOnPage = 0;

      $('table tbody tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length < 3) return;
        rowsOnPage++;

        // ── Problem (column 1) ──
        const link = $(cells[1]).find('a').first();
        const href = link.attr('href') || '';
        const problemName = link.text().trim();

        // Extract code from: /CONTESTCODE/problems/PROBCODE or /problems/PROBCODE
        const codeMatch =
          href.match(/\/problems\/([A-Z0-9_]+)/i) ||
          href.match(/problems\/([A-Z0-9_]+)/i);
        if (!codeMatch) return;

        const problemCode = codeMatch[1].toUpperCase();
        const problemUrl = href.startsWith('http')
          ? href
          : `https://www.codechef.com${href}`;

        // ── Verdict (column 2) ──
        // CodeChef stores verdict as title attr on a <span> wrapping an <img>
        const verdictCell = $(cells[2]);
        const verdictTitle = (
          verdictCell.find('span[title]').attr('title') ||
          verdictCell.find('img[alt]').attr('alt') ||
          verdictCell.text()
        ).toLowerCase().trim();

        const isAC =
          verdictTitle.includes('correct answer') ||
          verdictTitle.includes('accepted') ||
          verdictTitle === 'ac';

        if (isAC) {
          solvedSet.add(problemCode);
        } else if (!attemptedMap.has(problemCode)) {
          attemptedMap.set(problemCode, {
            name: problemName || problemCode,
            url: problemUrl,
          });
        }
      });

      if (rowsOnPage === 0) break;
      const maxPage = typeof data === 'object' ? (parseInt(data.max_page, 10) || 0) : 0;
      if (page >= maxPage - 1) break;
    }

    // Return only problems attempted but NEVER fully solved
    const result = [];
    for (const [code, info] of attemptedMap) {
      if (!solvedSet.has(code)) {
        result.push({
          platform: 'codechef',
          problemId: code,
          name: info.name,
          url: info.url,
          difficulty: null,
        });
      }
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error('CodeChef error:', err.message);
    if (err.response?.status === 404) {
      return res.status(404).json({ error: `CodeChef user "${handle}" not found.` });
    }
    return res.status(500).json({ error: 'Failed to fetch CodeChef data', detail: err.message });
  }
}
