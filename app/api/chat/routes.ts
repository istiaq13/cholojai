import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are a friendly travel assistant for "choloJai", a Bangladesh-based travel agency.

Our Destinations:
- Sajek Valley (৳8,000 - 2D/1N)
- Cox's Bazar (৳6,000 - 3D/2N)  
- Bangkok, Thailand (৳35,000 - 4D/3N)
- Dubai, UAE (৳45,000 - 4D/3N)

Guidelines:
1. Be warm, friendly, and helpful
2. If user asks about destinations we DON'T offer, politely inform them and suggest contacting us via WhatsApp for custom packages
3. Always keep responses concise (2-3 sentences max)
4. End with encouraging them to chat on WhatsApp for bookings
5. Use emojis sparingly but appropriately

Remember: We only offer packages to Bangladesh (Sajek, Cox's Bazar), Thailand (Bangkok), and UAE (Dubai).`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 250,
      },
    });

    const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${message}\n\nYour Response (2-3 sentences max):`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return NextResponse.json({ 
      response: text,
      source: 'ai'
    });

  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json({
      response: "I'm having trouble connecting right now. Please chat with our team on WhatsApp for immediate assistance! 😊",
      error: true,
      source: 'error'
    }, { status: 200 }); 
  }
}