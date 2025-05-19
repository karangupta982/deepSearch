import { GroqResponse } from '../types';

const GROQ_API_BASE_URL = "https://api.groq.com/openai/v1";

export const HIGH_ACCURACY_MODELS = {
  LLAMA2_70B: "llama2-70b-4096",
  MIXTRAL_8X7B: "mixtral-8x7b-32768",
  LLAMA3_70B: "llama3-70b-8192",
  LLAMA3_8B: "llama3-8b-8192",
};

export async function fetchGroqResponse(message: string): Promise<GroqResponse> {
  try {
    const model = HIGH_ACCURACY_MODELS.LLAMA3_70B;
    
    const response = await fetch('/api/groq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response from Groq API');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Groq response:', error);
    throw error;
  }
}