export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
  
    const { prompt } = req.body;
  
    const chapterInstruction =
      'ABSOLUTE STRICT RULE: Every single chapter body must contain EXACTLY 3 sentences. Count them. No chapter may have 2 sentences or 4 sentences. Exactly 3. This is non-negotiable.';

    const statsInstruction =
      'Generate a stats object that reflects where this person ends up after following through on their decision. Use these rules: ' +
      '1) Bold risky decisions like quitting jobs, moving abroad, or starting businesses should have high variance — finance between 35-85, fulfilment between 60-90. ' +
      '2) Safe or inward decisions like therapy, school, or staying put should have moderate finance 45-70 and high fulfilment 65-85. ' +
      '3) A stronger starting foundation higher salary positive networth raises the finance floor by 10-15 points. ' +
      '4) Decisions involving major personal sacrifice raise fulfilment but lower relationships slightly. ' +
      '5) Never make all scores high or all scores low — life is always a tradeoff. ' +
      '6) Overall is the average of finance happiness and relationships. Return stats as: stats with finance happiness health relationships and overall where all numbers are between 20 and 95.';
  
    const fullPrompt = `${prompt}\n\n${chapterInstruction}\n\n${statsInstruction}`;
  
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: fullPrompt }]
      })
    });
  
    const data = await response.json();
    res.status(200).json(data);
  }