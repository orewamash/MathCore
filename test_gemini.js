require('dotenv').config({ path: '.env.local' });
const { generateText } = require('ai');
const { google } = require('@ai-sdk/google');

async function test() {
  try {
    const response = await generateText({
      model: google('gemini-1.5-flash-latest'), 
      prompt: 'hello',
    });
    console.log("SUCCESS:", response.text);
  } catch (e) {
    console.error("1.5-flash-latest ERROR:", e.message);
  }
}
test();
