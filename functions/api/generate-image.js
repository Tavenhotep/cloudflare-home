const MODEL = "gemini-3.1-flash-image";
const MAX_PROMPT_LENGTH = 800;

export async function onRequestPost({ request, env }) {
  if (!env.GEMINI_API_KEY) {
    return Response.json({ error: "Image generation is not configured yet. Add the GEMINI_API_KEY secret in your Cloudflare Pages settings." }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please enter a short image idea and try again." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt || prompt.length > MAX_PROMPT_LENGTH) {
    return Response.json({ error: `Your idea must be between 1 and ${MAX_PROMPT_LENGTH} characters.` }, { status: 400 });
  }

  try {
    const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Create one original, friendly illustration based on this idea. Make it visually clear, colorful, and suitable for a personal homepage. User idea: ${prompt}` }] }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: "4:3", imageSize: "1K" },
        },
      }),
    });

    const data = await googleResponse.json();
    if (!googleResponse.ok) {
      return Response.json({ error: "Google could not generate that image. Try a different idea in a moment." }, { status: 502 });
    }

    const image = data.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data)?.inlineData;
    if (!image) {
      return Response.json({ error: "No image came back for that idea. Please try another prompt." }, { status: 502 });
    }

    return Response.json({ image: image.data, mimeType: image.mimeType || "image/png" });
  } catch {
    return Response.json({ error: "Could not reach the image service. Please try again." }, { status: 502 });
  }
}
