const body = {
  model: 'gpt-5-nano',
  messages: [
    { role: 'system', content: [{ type: 'text', text: 'You are a helpful assistant.' }] },
    { role: 'user', content: [{ type: 'text', text: 'List three colors.' }] }
  ],
  max_completion_tokens: 50
};

const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

console.log(await res.text());
