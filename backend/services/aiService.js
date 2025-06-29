import { config } from "../config/config.js";

const getLLMResponse = async (userInput) => {
  const apiKey = config.openRouterApiKey;
  if (!apiKey) {
    console.error("OpenRouter API key is not configured in backend/.env");
    throw new Error("AI service is not configured.");
  }

  // Normalize user input for checking
  const lowerCaseInput = userInput.toLowerCase().trim();
  const greetingKeywords = ["hello", "hi", "hey", "how are you"];

  // Check if the input is a simple greeting
  const isGreeting = greetingKeywords.some((keyword) =>
    lowerCaseInput.startsWith(keyword)
  );

  let systemPrompt;

  if (isGreeting) {
    systemPrompt =
      "You are a friendly and helpful real estate assistant for a UAE-based company called EmiratEstate. Respond to greetings warmly and briefly. Invite the user to ask questions about the UAE real estate market, such as property prices, market trends, or investment opportunities.";
  } else {
    systemPrompt =
      "You are a professional real estate analyst specialized in the UAE market. When answering, always follow this structure:\n\n1. **Market Overview**: One brief paragraph summarizing the current real estate climate in Dubai.\n2. **Key Trends**: Bullet points highlighting up to 3 major trends, each with a relevant statistic (price change %, rental yields, new developments, etc.).\n3. **Government & Regulatory Impact**: Briefly summarize recent policies (e.g., foreign ownership, visa reforms) and their effect.\n4. **Emerging Areas**: List 2–3 districts gaining traction, and why (include figures if possible).\n5. **Conclusion**: One-sentence outlook.\n\nOutput must be under 200 words. Avoid filler. Use markdown formatting with bold labels (e.g., **Market Overview:**).\n\nWhen presenting any numerical data or statistics, format them in **bold markdown** using `**` around the values. This includes prices, percentages, square footage, dates, and any other numbers. Examples:\n- **AED 2,500/sqft**\n- **6.8% rental yield**\n- **12.3% YoY increase**";
  }

  try {
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

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage =
        errorBody.error?.message ||
        `API request failed with status ${response.status}`;
      console.error("OpenRouter API error:", response.status, errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content?.trim() ||
      "I'm still learning! Ask about property types, pricing, or VAT."
    );
  } catch (error) {
    console.error("Error getting LLM response:", error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
};

export { getLLMResponse };
