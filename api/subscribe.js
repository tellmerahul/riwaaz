const fs = require('fs');
const path = require('path');

function loadLocalEnv() {
  if (process.env.GOOGLE_SHEET_SCRIPT_URL) return;

  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const envPath = path.join(process.cwd(), file);
    if (!fs.existsSync(envPath)) continue;

    fs.readFileSync(envPath, 'utf8')
      .split('\n')
      .forEach(function (line) {
        const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2].trim();
        }
      });
    break;
  }
}

loadLocalEnv();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const scriptUrl = (process.env.GOOGLE_SHEET_SCRIPT_URL || '').trim();
  if (!scriptUrl) {
    return res.status(500).json({
      ok: false,
      error: 'Server not configured. Add GOOGLE_SHEET_SCRIPT_URL to .env.local',
    });
  }

  let body = req.body;
  if (typeof body === 'string' && body.length) {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  if (!body || typeof body !== 'object') {
    body = {};
  }

  const email = String(body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address' });
  }

  try {
    const url = new URL(scriptUrl);
    url.searchParams.set('email', email);

    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch (parseErr) {
      console.error('Sheet response not JSON:', text.slice(0, 300));

      if (text.includes('Script function not found: doGet')) {
        return res.status(502).json({
          ok: false,
          error: 'Apps Script is missing doGet. Paste google-apps-script.js, save, then Deploy → New version.',
        });
      }

      if (text.includes('accounts.google.com')) {
        return res.status(502).json({
          ok: false,
          error: 'Apps Script access is not public. Set Who has access to Anyone and redeploy.',
        });
      }

      return res.status(502).json({
        ok: false,
        error: 'Google Sheet not reachable. Check Apps Script deployment and URL in env.',
      });
    }

    if (!result.ok) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to save email' });
  }
};
