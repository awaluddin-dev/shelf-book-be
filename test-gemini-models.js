const apiKey = process.env.GEMINI_API_KEY;
(async () => {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  const generateContentModels = data.models.filter(m => m.supportedGenerationMethods.includes('generateContent')).map(m => m.name.replace('models/', ''));
  console.log(generateContentModels);
})();
