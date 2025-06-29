import firecrawlService from "../services/firecrawlService.js";
import { getLLMResponse } from "../services/aiService.js";
import Property from "../models/propertymodel.js"; // Import the Property model

export const searchProperties = async (req, res) => {
  try {
    const { city, maxPrice, limit = 6 } = req.body;

    if (!city || !maxPrice) {
      return res
        .status(400)
        .json({ success: false, message: "City and maxPrice are required" });
    }

    // 1. Fetch properties from Firecrawl
    const properties = await firecrawlService.findProperties(
      city,
      maxPrice,
      Math.min(limit, 6) // Ensure limit is not over 6
    );

    // 2. Create a detailed prompt for the AI service
    const propertyDetails = properties
      .map(
        (p, i) =>
          `Property ${i + 1}: ${p.description || "No description available."}`
      )
      .join("\n\n");

    const analysisPrompt = `Analyze the following real estate properties found in ${city} for under ${maxPrice.toLocaleString()} AED. Provide a concise market summary of these findings, highlighting common features, potential value, and any red flags. Start with a direct, one-sentence overview.\n\n${propertyDetails}`;

    // 3. Get analysis from the refactored AI Service
    const analysis = await getLLMResponse(analysisPrompt);

    res.json({
      success: true,
      properties: properties,
      analysis,
    });
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search properties",
      error: error.message,
    });
  }
};

// Correctly handles fetching and returning city price analysis
export const getCityPriceAnalysis = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res
        .status(400)
        .json({ success: false, message: "City parameter is required" });
    }

    // Firecrawl service now handles fetching and summarizing
    const analysisResult = await firecrawlService.getCityPriceAnalysis(city);

    if (!analysisResult.success) {
      // Pass through the error from the service
      return res.status(500).json(analysisResult);
    }

    res.json(analysisResult);
  } catch (error) {
    console.error("Error getting city price analysis:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get city price analysis",
      error: error.message,
    });
  }
};

// New function to get all properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}); // Fetch all properties
    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error("Error fetching all properties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all properties",
      error: error.message,
    });
  }
};

// New function to get properties by filters (availability and location)
export const getPropertiesByFilters = async (req, res) => {
  try {
    const { type, location } = req.query;
    const mongoQuery = {};

    if (location) {
      mongoQuery.location = new RegExp(location, "i"); // Case-insensitive search
    }

    if (type) {
      if (type.toLowerCase() === "buy") {
        mongoQuery.availability = "For Sale";
      } else if (type.toLowerCase() === "rent") {
        mongoQuery.availability = "For Rent";
      }
      // If type is something else or not provided, it won't filter by availability unless specified
    }

    const properties = await Property.find(mongoQuery);

    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties by filters:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties by filters",
      error: error.message,
    });
  }
};

// Debug route to test Firecrawl API with https://example.com
export const testFirecrawl = async (req, res) => {
  try {
    const result = await firecrawlService.testScrapeUrl();
    res.json({ success: true, result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Test failed", error: error.message });
  }
};
