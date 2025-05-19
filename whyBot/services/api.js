import axios from 'axios';

export async function generateAnswer(question) {
  try {
    const response = await axios.post('/api/groq', { question });
    return response.data;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    
    // Extract more detailed error information
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
    const errorDetails = error.response?.data?.details || '';
    
    throw new Error(`Failed to generate answer: ${errorMessage}. ${errorDetails}`);
  }
}