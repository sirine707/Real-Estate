import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  firecrawlApiKey: process.env.FIRECRAWL_API_KEY,
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,
  modelId: process.env.MODEL_ID || "HuggingFaceH4/zephyr-7b-beta",
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  openAIApiKey: process.env.OPENAI_API_KEY,
  azureApiKey: process.env.AZURE_API_KEY,
  useAzure: process.env.USE_AZURE === "true",
};
