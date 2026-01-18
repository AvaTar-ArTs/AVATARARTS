const responseId = process.argv[2];
if (!responseId) {
  console.error('Provide response id');
  process.exit(1);
}

const res = await fetch(`https://api.openai.com/v1/responses/${responseId}`, {
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  },
});
console.log(await res.text());
