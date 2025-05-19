import type { NextApiRequest, NextApiResponse } from 'next';
import { generateQAFlow, generateRandomQuestion } from '../../lib/GroqClient';
import type { GroqResponse } from '../../types';
import { Groq } from 'groq-sdk'; // or the exact package name you use


type ResponseData =
  | GroqResponse
  | { message: string }
  | { question: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { action, question } = req.body as {
      action: 'generateFlow' | 'randomQuestion';
      question?: string;
    };

    if (action === 'generateFlow' && question) {
      const response = await generateQAFlow(question);
      return res.status(200).json(response);
    } else if (action === 'randomQuestion') {
      const randomQuestion = await generateRandomQuestion();
      return res.status(200).json({ question: randomQuestion });
    } else {
      return res.status(400).json({ message: 'Invalid action or missing question' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}