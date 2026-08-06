const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
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

  try {
    const url = `https://www.codechef.com/users/${handle}`;
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    const $ = cheerio.load(response.data);
    const solvedSet = new Set();
    const attempted = [];

    // --- Parse Fully Solved problems ---
    // CodeChef places them inside a section with heading "Fully Solved"
    $('article.problems-solved h5')
      .filter((_, el) => $(el).text().trim().toLowerCase().includes('fully solved'))
      .each((_, heading) => {
        // Sibling <div> contains the list
        $(heading)
          .next('div')
          .find('a')
          .each((_, a) => {
            const pid = $(a).text().trim().toUpperCase();
            if (pid) solvedSet.add(pid);
          });
      });

    // Also handle newer CodeChef layout: problems listed in .problem-solved sections
    $('.problem-solved .prob-name a, .problems-solved-section a').each((_, a) => {
      const pid = $(a).text().trim().toUpperCase();
      if (pid) solvedSet.add(pid);
    });

    // --- Parse Attempted / Partially Solved problems ---
    $('article.problems-solved h5')
      .filter((_, el) => {
        const text = $(el).text().trim().toLowerCase();
        return text.includes('attempted') || text.includes('partially');
      })
      .each((_, heading) => {
        $(heading)
          .next('div')
          .find('a')
          .each((_, a) => {
            const pid = $(a).text().trim().toUpperCase();
            if (pid && !solvedSet.has(pid)) {
              attempted.push(pid);
            }
          });
      });

    // Fallback: scan all problem links that aren't in solved set
    $('a[href^="/problems/"]').each((_, a) => {
      const href = $(a).attr('href') || '';
      const match = href.match(/^\/problems\/([A-Z0-9]+)$/i);
      if (match) {
        const pid = match[1].toUpperCase();
        if (!solvedSet.has(pid) && !attempted.includes(pid)) {
          // Only add if they appear in practice/contest sections
          const parent = $(a).closest('.problems-solved, .problems-attempted');
          if (parent.length > 0) {
            attempted.push(pid);
          }
        }
      }
    });

    // Deduplicate
    const unique = [...new Set(attempted)];

    const result = unique.map((pid) => ({
      platform: 'codechef',
      problemId: pid,
      name: pid,
      url: `https://www.codechef.com/problems/${pid}`,
      difficulty: null,
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error('CodeChef scrape error:', err.message);

    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: `CodeChef user "${handle}" not found` });
    }

    return res.status(500).json({ error: 'Failed to fetch CodeChef data', detail: err.message });
  }
};
