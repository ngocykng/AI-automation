import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!, // API key từ Google AI Studio
});

async function runGroq(prompt: string) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        }),
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    const data = await res.json();
    return data.choices[0].message.content;
}

async function runGemini(prompt: string, model: string) {
    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }]
            }
        ],
    });

    return response.text ?? "";
}
export const runAIAgent = async (
    input: string,
    config: any
): Promise<string> => {

    const prompt = config?.prompt || "";
    const provider = config?.provider || "gemini"; // 👈 chọn provider
    const model = config?.model;

    const fullPrompt = `${prompt}\n\nUser:\n${input}`;

    try {
        // ===== GEMINI =====
        if (provider === "gemini") {
            const geminiModel = model || "gemini-2.5-flash";
            return await runGemini(fullPrompt, geminiModel);
        }

        // ===== GROQ =====
        if (provider === "groq") {
            return await runGroq(fullPrompt);
        }

        return "";
    } catch (err) {
        console.log("Primary failed, switching provider...");

        // ===== FALLBACK =====
        if (provider === "gemini") {
            return await runGroq(fullPrompt);
        }

        throw err;
    }
};