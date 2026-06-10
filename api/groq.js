const KEYS = [
  process.env.GROQ_KEY_1,
  process.env.GROQ_KEY_2,
  process.env.GROQ_KEY_3,
].filter(Boolean);

let idx = 0;
const nextKey = () => KEYS[idx++ % KEYS.length];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { system, user } = req.body;
  if (!system || !user) return res.status(400).json({ error: 'Missing system or user' });

  const key = nextKey();
  if (!key) return res.status(500).json({ error: 'No API keys configured' });

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        temperature: 0.3,
        max_tokens: 900,
        messages: [
          { role: 'system', content: system },
          { role: 'user',   content: user }
        ]
      })
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      return res.status(groqRes.status).json({ error: err });
    }

    const data = await groqRes.json();
    res.status(200).json({ content: data.choices[0].message.content.trim() });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
