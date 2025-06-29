import { getLLMResponse } from "../services/aiService.js";

const handleChat = async (req, res) => {
  try {
    const { userInput } = req.body;
    if (!userInput) {
      return res.status(400).json({ error: "User input is required" });
    }

    const reply = await getLLMResponse(userInput);
    res.json({ reply });
  } catch (error) {
    console.error("Error in chat handler:", error);
    res
      .status(500)
      .json({ error: "Failed to get a response from the AI service." });
  }
};

export { handleChat };
