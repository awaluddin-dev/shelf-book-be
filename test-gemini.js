const apiKey = process.env.GEMINI_API_KEY;
(async () => {
  const model = 'gemini-3.6-flash';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: 'Say hello in 1 word' }] }),
  });
  console.log(res.status);
  console.log(await res.text());
})();
