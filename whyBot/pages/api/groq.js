import { GroqClient } from 'groq-sdk';
import { Groq } from 'groq-sdk'; // or the exact package name you use


// Initialize Groq client
const groq = new Groq({
    apiKey: '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',
    dangerouslyAllowBrowser: true,
  });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    console.log(`Processing question in API route: "${question}"`);
    
    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are WhyBot, an AI that answers questions and generates follow-up questions to explore topics deeper. Always provide a clear, concise answer followed by exactly 3 follow-up questions. Format your response with "Answer:" followed by your answer, then "Follow-up questions:" followed by numbered questions.' 
        },
        { 
          role: 'user', 
          content: `Answer this question: "${question}". Then generate 3 follow-up questions that would help explore this topic deeper.` 
        }
      ],
      model: 'llama3-8b-8192', // Using a more widely available model
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parse the response
    const responseText = completion.choices[0].message.content;
    console.log('API response:', responseText);
    
    // More robust parsing
    let answer = '';
    let followUpQuestions = [];
    
    // Try to extract answer and follow-up questions
    const answerMatch = responseText.match(/Answer:(.*?)(?=Follow-up questions:|$)/s);
    const questionsMatch = responseText.match(/Follow-up questions:(.*?)$/s);
    
    if (answerMatch && answerMatch[1]) {
      answer = answerMatch[1].trim();
    } else {
      // Fallback if format doesn't match
      const parts = responseText.split(/\d+\.\s+/);
      answer = parts[0].trim();
    }
    
    if (questionsMatch && questionsMatch[1]) {
      followUpQuestions = questionsMatch[1]
        .split(/\d+\.\s+/)
        .filter(q => q.trim().length > 0)
        .map(q => q.trim());
    } else {
      // Fallback extraction of numbered items
      const numberedItems = responseText.match(/\d+\.\s+([^\d]+?)(?=\d+\.|$)/g);
      if (numberedItems && numberedItems.length > 0) {
        followUpQuestions = numberedItems.map(item => 
          item.replace(/^\d+\.\s+/, '').trim()
        );
      }
    }
    
    // Ensure we have at least some follow-up questions
    if (followUpQuestions.length === 0) {
      followUpQuestions = [
        `Tell me more about ${question}?`,
        `What are the implications of ${question}?`,
        `How does ${question} affect everyday life?`
      ];
    }

    console.log('Parsed answer:', answer);
    console.log('Parsed follow-up questions:', followUpQuestions);

    return res.status(200).json({ answer, followUpQuestions });
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return res.status(500).json({ 
      error: 'Failed to generate answer', 
      details: error.message || 'Unknown error' 
    });
  }
}