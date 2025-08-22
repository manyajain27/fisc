import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Enable for client-side usage
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Tax-specific system prompt for FiscAI
const SYSTEM_PROMPT = `You are FiscAI, an expert tax optimization assistant for the Indian tax system. You specialize in:

1. Tax Regime Comparison (Old vs New)
2. Investment Tax Planning (STCG, LTCG, Dividends)
3. Deduction & Exemption Optimization
4. Tax-Loss Harvesting Strategies
5. Holding Period Optimization
6. Tax Calendar & Deadlines

Key Knowledge Areas:
- Income Tax Act, 1961 provisions
- Section 80C, 80D, and other deductions
- Capital gains tax rates and exemptions
- Tax-saving investment options (ELSS, PPF, NSC, etc.)
- Real estate tax implications
- Cryptocurrency taxation
- TDS and advance tax planning

CRITICAL GUIDELINES:
- ALWAYS provide precise answers backed by actual Indian tax laws
- MANDATORY: Quote specific sections of Income Tax Act, 1961 in your responses
- Example: "Under Section 80C of Income Tax Act, 1961..."
- Use plain text formatting - NO markdown symbols like **, -, or #
- Avoid bullet points with special characters
- Write in clear, simple sentences without formatting symbols
- Provide specific statutory references for every claim
- Include relevant notification numbers and dates when applicable
- Mention applicable rates with their legal basis

Response Format:
- Start with the specific legal provision
- Explain the practical application
- Provide current rates/limits with their source
- End with compliance requirements

Important: Always remind users to consult a qualified CA for complex scenarios and verify current rates as tax laws can change. All advice must be based on actual provisions of Indian tax legislation.`;

export const generateChatResponse = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    // Prepare messages for Groq
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage }
    ];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1000,
      stream: false
    });

    return completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
  } catch (error) {
    console.error('Error calling Groq API:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'Please configure your Groq API key in the environment variables.';
      } else if (error.message.includes('rate limit')) {
        return 'I\'m currently experiencing high traffic. Please try again in a moment.';
      }
    }
    
    return 'I\'m having trouble processing your request right now. Please try again later.';
  }
};

// Predefined quick responses for common tax queries
export const getQuickResponse = (query: string): string | null => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('regime') && (lowerQuery.includes('old') || lowerQuery.includes('new'))) {
    return `Tax Regime Comparison under Income Tax Act, 1961:

Old Regime (Default):
Under Section 11 of Income Tax Act, 1961, taxpayers can claim various deductions like Section 80C (up to Rs. 1.5 lakhs), Section 80D (Rs. 25,000 to Rs. 50,000), HRA under Section 10(13A), etc. This regime has higher tax slabs but allows multiple deductions.

New Regime (Section 115BAC):
Introduced by Finance Act 2020, Section 115BAC offers lower tax rates but restricts most deductions except standard deduction of Rs. 50,000 under Section 16 for FY 2023-24 as per Finance Act 2023.

Legal Analysis: Choose old regime if your total eligible deductions exceed Rs. 2.5 lakhs. The option under Section 115BAC(1A) allows switching between regimes each year.

Would you like me to calculate which regime works better for your specific income and deductions?`;
  }
  
  if (lowerQuery.includes('80c')) {
    return `Section 80C Deductions under Income Tax Act, 1961:

Legal Provision: Section 80C allows deduction up to Rs. 1,50,000 for investments in specified instruments.

Eligible Investments per Section 80C:
ELSS Mutual Funds (3-year lock-in under SEBI regulations)
Public Provident Fund (15-year lock-in under PPF Act, 1968)
National Savings Certificate (5-year lock-in)
Unit Linked Insurance Plans (5-year lock-in under IRDAI norms)
Home loan principal repayment
Life insurance premiums (subject to Section 10(10D) conditions)
Tax-saving fixed deposits (5-year lock-in)
Children tuition fees

Legal Note: ELSS offers shortest lock-in period under Section 80C while maintaining equity exposure benefits under Section 10(38) for LTCG exemption.

Need specific advice on optimizing your Section 80C investments?`;
  }
  
  return null;
};

export default groq;