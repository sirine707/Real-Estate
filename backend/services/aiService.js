import { config } from "../config/config.js";

const getLLMResponse = async (userInput) => {
  console.log("🤖 AI Service - getLLMResponse called");
  console.log("- Input length:", userInput?.length || 0);
  console.log("- Input preview:", userInput?.substring(0, 200) + "...");

  const apiKey = config.openRouterApiKey;
  if (!apiKey) {
    console.error("❌ OpenRouter API key is not configured in backend/.env");
    throw new Error("AI service is not configured.");
  }

  console.log("✅ API key found, length:", apiKey.length);

  // Normalize user input for checking
  const lowerCaseInput = userInput.toLowerCase().trim();
  const greetingKeywords = ["hello", "hi", "hey", "how are you"];

  // Check if the input is a simple greeting
  const isGreeting = greetingKeywords.some((keyword) =>
    lowerCaseInput.startsWith(keyword)
  );

  console.log("🔍 Input analysis:");
  console.log("- Is greeting:", isGreeting);

  let systemPrompt;

  if (isGreeting) {
    systemPrompt =
      "You are a friendly and helpful real estate assistant for a UAE-based company called EmiratEstate. Respond to greetings warmly and briefly. Invite the user to ask questions about the UAE real estate market, such as property prices, market trends, or investment opportunities.";
  } else {
    systemPrompt =
      "You are a professional real estate analyst specialized in the UAE market. When answering, always follow this structure:\n\n1. **Market Overview**: One brief paragraph summarizing the current real estate climate in Dubai.\n2. **Key Trends**: Bullet points highlighting up to 3 major trends, each with a relevant statistic (price change %, rental yields, new developments, etc.).\n3. **Government & Regulatory Impact**: Briefly summarize recent policies (e.g., foreign ownership, visa reforms) and their effect.\n4. **Emerging Areas**: List 2–3 districts gaining traction, and why (include figures if possible).\n5. **Conclusion**: One-sentence outlook.\n\nOutput must be under 200 words. Avoid filler. Use markdown formatting with bold labels (e.g., **Market Overview:**).\n\nWhen presenting any numerical data or statistics, format them in **bold markdown** using `**` around the values. This includes prices, percentages, square footage, dates, and any other numbers. Examples:\n- **AED 2,500/sqft**\n- **6.8% rental yield**\n- **12.3% YoY increase**";
  }

  console.log("📝 System prompt selected, length:", systemPrompt.length);

  try {
    console.log("🌐 Making request to OpenRouter API...");
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen/qwen3-30b-a3b",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            { role: "user", content: userInput },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      }
    );

    console.log("📡 API Response status:", response.status);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage =
        errorBody.error?.message ||
        `API request failed with status ${response.status}`;
      console.error("❌ OpenRouter API error:", response.status, errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("📊 API Response data structure:");
    console.log("- Has choices:", !!data.choices);
    console.log("- Choices length:", data.choices?.length || 0);
    console.log("- First choice has message:", !!data.choices?.[0]?.message);
    console.log(
      "- Content length:",
      data.choices?.[0]?.message?.content?.length || 0
    );

    const aiResponse =
      data.choices[0]?.message?.content?.trim() ||
      "I'm still learning! Ask about property types, pricing, or VAT.";

    console.log("✅ AI Response generated:");
    console.log("- Response length:", aiResponse.length);
    console.log("- Response preview:", aiResponse.substring(0, 200) + "...");

    return aiResponse;
  } catch (error) {
    console.error("❌ Error getting LLM response:", error);
    console.error("Error stack:", error.stack);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
};

export { getLLMResponse };
