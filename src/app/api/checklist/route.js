import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
}

export async function POST(request) {
  try {
    const { query } = await request.json();

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_KEY, // Securely load your API key from environment variables
    });

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      temperature: 0,
      system:
        "Provide only the JavaScript code, JSON in precise without whitespaces for a function that returns an array of checklist items that can be iterated. example: [{id: 1, title: do something, content: do something today}, {id: 2, title: do something, content: do something today}]. Return pure arrays without additional text",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: query, // Use the query sent from the client
            },
          ],
        },
      ],
    });

    return NextResponse.json({ data: msg });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
