const GPT_SYSTEM_PROMPT = `You are a financial analyst AI assistant. Analyze the provided bank statement and:
1. Categorize each transaction into appropriate categories
2. Identify spending patterns and trends
3. Provide specific, actionable financial advice
4. Flag any unusual or concerning transactions
5. Suggest potential areas for cost savings
6. Calculate spending distribution across categories

Format your response in clear sections:
- Transaction Analysis
- Spending Patterns
- Recommendations
- Potential Savings
- Risk Flags (if any)`;

const GPT_USER_PROMPT = `Please analyze this bank statement and provide insights:
{statementText}

Focus on:
1. Monthly spending patterns
2. Largest expense categories
3. Potential areas of overspending
4. Specific savings opportunities
5. Any suspicious activities
6. Budget optimization suggestions`;

export async function analyzeWithGPT(statementText: string) {
  console.log("statementText", statementText)
  try {
    // const apiKey = process.env.REACT_APP_GPT_API_KEY;
    const apiKey = import.meta.env.VITE_GPT_API_KEY;
    if (!apiKey) {
      throw new Error("API Key is not defined in the environment variables");
    }

    // Replace with your API endpoint and key
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Replace with your API key
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'developer',
            content: GPT_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: GPT_USER_PROMPT.replace('{statementText}', statementText)
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('GPT API Error:', error);
    throw new Error('Failed to analyze statement with GPT');
  }
}