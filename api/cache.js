const CACHE_TTL_MS = 60 * 60 * 1000; // 1 uur

let store = null; // { cards, generatedAt }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET') {
    if (!store || (Date.now() - store.generatedAt) > CACHE_TTL_MS) {
      return res.status(204).end(); // geen geldige cache
    }
    return res.status(200).json(store);
  }

  if (req.method === 'POST') {
    const { cards, generatedAt } = req.body;
    if (!cards || !generatedAt) return res.status(400).json({ error: 'Missing cards or generatedAt' });
    store = { cards, generatedAt };
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
