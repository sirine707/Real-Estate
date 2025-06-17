import dotenv from 'dotenv'; // Added dotenv import
dotenv.config(); // Load .env variables directly here

// import { config } from "../config/config.js"; // Commented out config import
// import ModelClient, { isUnexpected } from "@azure-rest/ai-inference"; // Commented out Azure import
// import { AzureKeyCredential } from "@azure/core-auth"; // Commented out Azure import

class AIService {
  constructor() {
    // this.azureApiKey = config.azureApiKey; // Commented out Azure API key
    // this.huggingFaceApiKey = config.huggingfaceApiKey; // Changed to load directly from process.env
    this.huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY;
    // this.huggingFaceModel = config.modelId || "HuggingFaceH4/zephyr-7b-beta"; // Changed to load directly from process.env
    this.huggingFaceModel = process.env.MODEL_ID || "HuggingFaceH4/zephyr-7b-beta";
  }

  async generateText(prompt) {
    // return this.generateTextWithAzure(prompt); // Changed to Hugging Face
    return this.generateTextWithHuggingFace(prompt);
  }

  async generateTextWithHuggingFace(prompt) {
    try {
      console.log(`Starting Hugging Face AI generation at ${new Date().toISOString()}`);
      const startTime = Date.now();

      // Zephyr prompt format
      const formattedPrompt = `<|system|>You are a sophisticated AI real estate expert specializing in the United Arab Emirates (UAE) market. Your goal is to provide insightful, data-driven analysis of property information.
When discussing prices or financial aspects, always use Emirati Dirhams (AED) and specify amounts clearly (e.g., AED 1.5 Million, AED 500,000).
Provide comprehensive analysis that includes:
-   Market context: Briefly touch upon relevant UAE market trends if applicable.
-   Value assessment: Go beyond just listing features; explain their significance in the UAE context.
-   Potential considerations: Highlight any unique opportunities or potential drawbacks for a buyer/investor in the UAE.
-   Clarity and Conciseness: While being thorough, ensure your response is easy to understand.
-   Formatting: Use clear paragraphs. For lists or recommendations, use bullet points (e.g., * Item) or numbered lists where appropriate. Do not start your response with any special characters like backslashes unless it is part of standard markdown like a bullet point. Avoid unnecessary leading or trailing whitespace.</s>
<|user|>
${prompt}</s>
<|assistant|>`;

      const response = await fetch(
        `https://api-inference.huggingface.co/models/${this.huggingFaceModel}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.huggingFaceApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: formattedPrompt,
            parameters: {
              max_new_tokens: 800, // Similar to Azure's max_tokens
              temperature: 0.7,
              return_full_text: false, // Important to get only the generated part
              top_p: 0.95 // Adjusted from 1 to be within valid range (>0.0 and <1.0)
            },
          }),
        }
      );

      const endTime = Date.now();
      console.log(`Hugging Face AI generation completed in ${(endTime - startTime) / 1000} seconds`);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: "Failed to parse error from Hugging Face API" }));
        console.error('Hugging Face API error:', response.status, errorBody);
        throw new Error(errorBody.error || `Hugging Face API request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data && data[0] && data[0].generated_text) {
        let generatedText = data[0].generated_text.trim();
        // Remove common leading unwanted characters if they are not part of a list item
        if (generatedText.startsWith('\\') && !generatedText.startsWith('\\*') && !generatedText.startsWith('\\-')) {
          generatedText = generatedText.substring(1).trim();
        }
        // Further cleanup for any other specific unwanted leading sequences can be added here
        return generatedText;
      }
      // Handle cases where the model might return an error or unexpected format within a 200 OK
      if (data.error) {
        console.error("Hugging Face model error:", data.error);
        throw new Error(data.error);
      }
      if (data.estimated_time) {
        // Model is loading
        console.warn("Hugging Face model is loading, try again soon.");
        return "The AI model is currently loading, please try again in a moment.";
      }
      console.error("Unexpected response format from Hugging Face:", data);
      throw new Error("Unexpected response format from Hugging Face API.");

    } catch (error) {
      console.error("Error generating text with Hugging Face:", error);
      return `Error: ${error.message}`;
    }
  }

  // Commenting out the Azure function as it's replaced
  /*
  async generateTextWithAzure(prompt) {
    try {
      console.log(`Starting Azure AI generation at ${new Date().toISOString()}`);
      const startTime = Date.now();
      
      const client = ModelClient(
        "https://models.inference.ai.azure.com",
        new AzureKeyCredential(this.azureApiKey)
      );

      const response = await client.path("/chat/completions").post({
        body: {
          messages: [
            { 
              role: "system", 
              content: "You are an AI real estate expert assistant that provides concise, accurate analysis of property data."
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          model: "gpt-4o",
          temperature: 0.7,
          max_tokens: 800,
          top_p: 1
        }
      });

      const endTime = Date.now();
      console.log(`Azure AI generation completed in ${(endTime - startTime) / 1000} seconds`);

      if (isUnexpected(response)) {
        throw new Error(response.body.error.message || "Azure API error");
      }
      
      return response.body.choices[0].message.content;
    } catch (error) {
      console.error("Error generating text with Azure:", error);
      return `Error: ${error.message}`;
    }
  }
  */

  // Helper method to filter and clean property data before analysis
  _preparePropertyData(properties, maxPrice, propertyCategory, propertyType) {
    if (!properties || properties.length === 0) {
      return [];
    }
    return properties
      .filter(p => {
        const price = parseFloat(p.price?.replace(/[^\d.-]/g, ''));
        const meetsPrice = maxPrice ? price <= parseFloat(maxPrice) * 1000000 : true; // Assuming maxPrice is in millions
        const meetsCategory = propertyCategory ? p.category?.toLowerCase() === propertyCategory.toLowerCase() : true;
        const meetsType = propertyType ? p.type?.toLowerCase() === propertyType.toLowerCase() : true;
        return meetsPrice && meetsCategory && meetsType;
      })
      .map(p => ({
        // Keep essential details for the AI to analyze
        address: p.address || 'N/A',
        size: p.size || 'N/A',
        price: p.price || 'N/A',
        features: p.features || (p.amenities ? (Array.isArray(p.amenities) ? p.amenities.join(', ') : p.amenities) : 'N/A'),
        // Add any other fields you want the AI to specifically consider from the raw data
        // e.g., bedrooms: p.bedrooms, bathrooms: p.bathrooms
      }));
  }

  async analyzeProperties(
    properties, // Raw properties from Firecrawl/scraper
    city,
    maxPrice, // User input max price (e.g., "3")
    propertyCategory, // User input category (e.g., "Residential")
    propertyType // User input type (e.g., "Flat")
  ) {
    // Prepare and filter property data based on user's specific criteria BEFORE sending to AI
    const preparedProperties = this._preparePropertyData(properties, maxPrice, propertyCategory, propertyType);

    let prompt;

    if (preparedProperties.length === 0) {
      prompt = `As a real estate expert, you were asked to analyze properties in ${city} matching the following criteria:
        - Property Category: ${propertyCategory}
        - Property Type: ${propertyType}
        - Maximum Price: AED ${maxPrice} Million

        However, no properties from the provided list strictly matched all these criteria.

        Please provide a brief statement confirming that no properties matched these exact specifications. You can also offer general advice for finding ${propertyType}s in ${city} within this price range, if applicable, or suggest broadening the search criteria.
        Keep your response concise and helpful.
        `;
    } else {
      prompt = `As a real estate expert, analyze these specific properties found in ${city} that match the user's criteria:

          User Criteria:
          - Property Category: ${propertyCategory}
          - Property Type: ${propertyType}
          - Maximum Price: AED ${maxPrice} Million

          Matching Properties:
          ${JSON.stringify(preparedProperties, null, 2)}

          INSTRUCTIONS:
          1. Your analysis should ONLY focus on the properties listed above in the "Matching Properties" section.
          2. Provide a brief analysis with these sections. Use clear paragraphs and bullet points for lists:
             - **Property Overview:** (List basic facts about each property from the "Matching Properties" list. If multiple, use bullet points like "a. Property 1:", "b. Property 2:")
             - **Best Value Analysis:** (Based on the provided data for these specific properties, explain which offers the best value and why. Consider price, size, and features.)
             - **Quick Recommendations:** (Provide actionable recommendations related to these specific properties, possibly using bullet points.)
          3. When mentioning any monetary values or prices in your analysis, please use the format 'AED X.X Million' (e.g., AED 2.5 Million).

          Keep your response concise and focused on these properties only. Ensure the output is well-formatted for readability.
          Do not invent or list properties that are not in the "Matching Properties" section.
          `;
    }

    return this.generateText(prompt);
  }

  async analyzeLocationTrends(priceTrendData, city) { // Argument renamed from locations to priceTrendData
    // The input `priceTrendData` is now expected to be an object like:
    // {
    //   location_name: "...", 
    //   current_price_per_sqft: "...", 
    //   current_price_date: "...", 
    //   historical_prices: [{ period: "...", price_per_sqft: "..." }, ...]
    // }
    // The _prepareLocationData might not be necessary if we are passing the single object directly.
    // For simplicity, we'll pass the priceTrendData directly to JSON.stringify in the prompt.

    const prompt = `As a real estate expert, analyze the following price trend data for ${city}:

        **Price Trend Data for ${city}:**
        Current Average Price: ${priceTrendData?.current_price_per_sqft || 'N/A'} (as of ${priceTrendData?.current_price_date || 'N/A'})
        
        Historical Prices:
        ${priceTrendData?.historical_prices?.map(hp => `- ${hp.period}: ${hp.price_per_sqft}`).join('\n') || 'No historical data available'}

        Please provide your analysis in a well-structured format. Use clear paragraphs and bullet points where appropriate:
        1.  **Overall Trend Summary:** Briefly describe the general price trend (e.g., increasing, decreasing, stable) based on the provided current and historical data.
        2.  **Key Observations:** Highlight any significant changes or points of interest from the historical data compared to the current price.
        3.  **Market Sentiment:** Based on these trends, what could be the general market sentiment for apartments in ${city}? (e.g., buyer's market, seller's market, stable).
        4.  **Advice for Buyers/Sellers:** Offer brief advice for potential buyers or sellers in ${city} based on these trends.

        Keep your response concise and ensure good visual structure. Focus only on the provided price trend data for ${city}.
        `;

    return this.generateText(prompt);
  }
}

export default new AIService();