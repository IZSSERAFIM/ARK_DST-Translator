import { NextResponse } from "next/server";

const API_URL =
  process.env.ARK_API_URL ??
  "https://ark.cn-beijing.volces.com/api/v3/responses";
const API_KEY = process.env.ARK_API_KEY;
const MODEL_ID = process.env.ARK_MODEL_ID;

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Missing ARK_API_KEY environment variable" },
      { status: 500 }
    );
  }
  if (!MODEL_ID) {
    return NextResponse.json(
      { error: "Missing ARK_MODEL_ID environment variable" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const text = String(body?.text ?? "").trim();
  const source = String(body?.source_language ?? "zh");
  const target = String(body?.target_language ?? "en");

  if (!text) {
    return NextResponse.json(
      { error: "Text is required for translation" },
      { status: 400 }
    );
  }

  const payload = {
    model: MODEL_ID,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text,
            translation_options: {
              source_language: source,
              target_language: target
            }
          }
        ]
      }
    ]
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Translation service error", detail: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    const message = data?.output?.[0];
    const translation =
      message?.content?.[0]?.text ??
      data?.output?.text ??
      "No translation returned";

    return NextResponse.json({ translation, raw: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to reach translation service",
        detail: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
