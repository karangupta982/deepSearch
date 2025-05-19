import { Groq } from 'groq-sdk';

// Initialize the Groq client
const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});


// Function to generate question-answer pairs and follow-up questions
export async function generateQAFlow(question) {
  try {
    const prompt = `
    You are WhyBot, an assistant that specializes in exploring questions deeply. 
    Given the question: "${question}", please provide:
    1. A comprehensive answer to the question
    2. Three follow-up questions that would naturally extend the exploration of this topic

    Format your response strictly as a JSON object with the following structure:
    {
      "question": "<original question>",
      "answer": "<your detailed answer>",
      "followUpQuestions": ["<follow-up question 1>", "<follow-up question 2>", "<follow-up question 3>"]
    }
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Error generating QA flow:", error);
    throw error;
  }
}

// Function to get a random question when the user clicks "Random Question"
export async function generateRandomQuestion() {
  try {
    const prompt = `
    Generate an interesting, thought-provoking "why" question that would make people think deeply.
    The question should start with "Why" and be concise.
    Provide ONLY the question with no additional text or explanation.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 1.0,
      max_tokens: 50
    });

    return completion.choices[0]?.message?.content?.trim() || "Why do we dream?";
  } catch (error) {
    console.error("Error generating random question:", error);
    return "Why do we experience déjà vu?";
  }
}