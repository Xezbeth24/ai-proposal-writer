import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Receive 'instruction' from the frontend picker
    const { job, about, instruction } = await req.json();
    
    if (!job || !about || !instruction) {
      return NextResponse.json({ error: "Job, skills, and style template are required." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    // 2. Structuring the request with System (Role) and User (Data) messages
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Keeping your newer model
        messages: [
          { 
            role: "system", 
            content: `You are an expert Upwork freelancer. ${instruction} 
            Format requirements: Start with a personalized intro, use 2-3 bullets for skill-matching, provide a brief action plan, and end with a strong call to action.` 
          },
          { 
            role: "user", 
            content: `Job Description: ${job}\nMy Skills & Profile: ${about}` 
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      return NextResponse.json({ error: "Groq API error", details: errorData }, { status: 500 });
    }

    const data = await res.json();
    const proposal = data.choices?.[0]?.message?.content || "Error generating.";

    return NextResponse.json({ proposal });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
