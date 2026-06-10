export default async function handler(req, res) {
  const { url, count = 8 } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url param' });

  const apiKey = process.env.RSS2JSON_API_KEY;
  const upstream = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=${count}${apiKey ? '&api_key=' + apiKey : ''}`;

  try {
    const upstream_res = await fetch(upstream);
    const data = await upstream_res.json();
    res.status(upstream_res.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
