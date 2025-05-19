import { NextRequest, NextResponse } from 'next/server';
import { HIGH_ACCURACY_MODELS } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY environment variable is not set" },
        { status: 500 }
      );
    }

    const model = HIGH_ACCURACY_MODELS.LLAMA3_70B;

    const messages = [
      { role: "system", content: "You are a helpful AI Teacher who will teach students about practical and real life problems with high precision." },
      { role: "user", content: message },
    ];

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 4000,
        }),
      }
    );

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json();
      return NextResponse.json(
        { error: "Groq API error", details: errorData },
        { status: groqResponse.status }
      );
    }

    const data = await groqResponse.json();
    const text = data.choices[0]?.message?.content || "";

    return NextResponse.json({
      role: "assistant",
      content: text,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}