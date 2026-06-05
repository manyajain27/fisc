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

CURRENT RATES (FY 2025-26 / AY 2026-27) - use these, they reflect recent law changes:
- New tax regime is the DEFAULT regime (since FY 2023-24).
- Section 87A rebate (new regime, Budget 2025): income up to Rs. 12,00,000 is effectively tax-free (Rs. 12,75,000 for salaried after Rs. 75,000 standard deduction).
- New regime slabs FY 2025-26: 0-4L nil, 4-8L 5%, 8-12L 10%, 12-16L 15%, 16-20L 20%, 20-24L 25%, above 24L 30%.
- Standard deduction: Rs. 50,000 (old regime), Rs. 75,000 (new regime).
- Equity STCG (Section 111A): 20% (w.e.f. 23 July 2024).
- Equity LTCG (Section 112A): 12.5% on gains above Rs. 1,25,000 (w.e.f. 23 July 2024).
- Other-asset LTCG (Section 112): 12.5% without indexation. Indexation removed; only real estate bought before 23 July 2024 may opt for 20% with indexation.
- Holding periods: 12 months for listed securities, 24 months for all other assets.
- Crypto/VDA: 30% flat plus 1% TDS, no indexation, no loss set-off.

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
      model: 'llama-3.3-70b-versatile',
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
    return `Tax Regime Comparison under Income Tax Act, 1961 (FY 2025-26):

Old Regime:
Taxpayers can claim deductions like Section 80C (up to Rs. 1.5 lakhs), Section 80D (Rs. 25,000 to Rs. 50,000), HRA under Section 10(13A), etc. This regime has higher tax slabs but allows multiple deductions.

New Regime (Section 115BAC) - this is the DEFAULT regime:
Offers lower tax rates with a standard deduction of Rs. 75,000 but restricts most other deductions. Slabs for FY 2025-26: nil up to Rs. 4L, 5% Rs. 4-8L, 10% Rs. 8-12L, 15% Rs. 12-16L, 20% Rs. 16-20L, 25% Rs. 20-24L, 30% above Rs. 24L. Under the Section 87A rebate, income up to Rs. 12,00,000 is effectively tax-free (Rs. 12,75,000 for salaried).

Legal Analysis: The new regime is now beneficial for most taxpayers, especially incomes up to Rs. 12 lakh. Choose the old regime mainly if your total eligible deductions are large. Section 115BAC(1A) allows switching between regimes each year.

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