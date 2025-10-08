import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import databank from '@/data/packages.json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const SYSTEM_PROMPT = `You are a friendly travel assistant for "choloJai", a Bangladesh-based travel agency.

Our Available Packages:
- Sajek Valley (৳8,000 - 2D/1N) - Bangladesh
- Cox's Bazar (৳6,000 - 3D/2N) - Bangladesh  
- Bangkok, Thailand (৳35,000-৳65,000 - 4D/3N to 5D/4N)
- Dubai, UAE (৳45,000 - 4D/3N)

Key Guidelines:
1. Be warm, conversational, and helpful
2. If user asks about destinations we DON'T offer (e.g., Italy, Malaysia, Maldives), politely say we don't have that package currently, but they can request custom packages via WhatsApp
3. Keep responses SHORT and conversational (2-3 sentences max)
4. Use emojis sparingly (1-2 per response max)
5. Always sound helpful and encouraging
6. Don't use bullet points or lists in responses - keep it natural conversation

Important: If the question is about a destination or country we don't serve, be honest and redirect to WhatsApp.

Example responses:
- "We don't have Italy packages right now, but our team can help arrange custom trips! Chat with us on WhatsApp to discuss your dream destination 🌍"
- "Great question! Our packages range from ৳6,000 to ৳65,000 depending on destination and comfort level. Want specific details? Let's chat on WhatsApp!"`;

// Enhanced package detection function
function detectPackages(query: string): typeof databank.packages {
  const normalizedQuery = query.toLowerCase().trim();
  const matchedPackages: typeof databank.packages = [];

  // Search for package matches
  databank.packages.forEach(pkg => {
    const searchTerms = [
      pkg.destination.toLowerCase(),
      pkg.name.toLowerCase(),
      pkg.country.toLowerCase()
    ];
    
    // Check if any search term matches
    const isMatch = searchTerms.some(term => 
      normalizedQuery.includes(term) || term.includes(normalizedQuery)
    );
    
    if (isMatch) {
      matchedPackages.push(pkg);
    }
  });

  return matchedPackages;
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json({
        response: "I'm having connection issues. Please chat with our team on WhatsApp for immediate assistance! 😊",
        error: true,
        source: 'error'
      }, { status: 200 });
    }

    // First, check if query is asking about specific packages
    const matchedPackages = detectPackages(message);
    
    if (matchedPackages.length > 0) {
      // Return package data to display as cards
      return NextResponse.json({
        response: matchedPackages.length === 1 
          ? `Great choice! Here's our ${matchedPackages[0].name} package 🌟`
          : `We have ${matchedPackages.length} amazing options for you! 🎉`,
        packages: matchedPackages,
        source: 'package',
        showCards: true
      });
    }

    // If no package match, use OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || 
      "I'm having trouble right now. Please chat with our team on WhatsApp for immediate help! 😊";

    return NextResponse.json({ 
      response: responseText,
      source: 'ai',
      showCards: false
    });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    if (error?.status === 401) {
      return NextResponse.json({
        response: "I'm having connection issues. Please chat with our team on WhatsApp for immediate assistance! 😊",
        error: true,
        source: 'error',
        details: 'Invalid API key'
      }, { status: 200 });
    }

    return NextResponse.json({
      response: "I'm having trouble connecting right now. Please chat with our team on WhatsApp for immediate assistance! 😊",
      error: true,
      source: 'error'
    }, { status: 200 }); 
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}