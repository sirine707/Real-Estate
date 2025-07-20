import FireCrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";
import playwright from "playwright";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

// Zod schema for structured data extraction
const PropertySchema = z.object({
  properties: z.array(
    z.object({
      url: z.string().url(),
      description: z.string(),
    })
  ),
});

const Property = z.object({
  url: z.string().url(),
  description: z.string(),
});

const Properties = z.array(Property);

class FirecrawlService {
  constructor() {
    this.firecrawl = new FireCrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY,
    });
  }

  /**
   * Maps local property type to Bayut URL format
   */
  _mapPropertyTypeToBayutUrl(propertyType) {
    const map = {
      flat: "apartments",
      apartment: "apartments",
      villa: "villas",
      townhouse: "townhouses",
      penthouse: "penthouses",
    };
    return map[propertyType.toLowerCase()] || "apartments";
  }

  /**
   * Validates that the URL is valid before scraping
   */
  _validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.error(`[FirecrawlService] Invalid URL: ${url}`);
      return false;
    }
  }

  /**
   * Normalizes URLs (adds https:// if missing)
   */
  _normalizeUrl(url) {
    let normalized = url.trim();
    if (!normalized.startsWith("http")) {
      normalized = `https://${normalized}`;
    }
    return normalized;
  }

  /**
   * Scrapes properties based on location, price, and type
   */
  async findProperties(city, maxPrice, limit = 2) {
    try {
      const query = `Find real estate properties for sale in ${city}, UAE, priced under ${maxPrice.toLocaleString()} AED.`;

      console.log(`🔥 [FirecrawlService] Starting property search...`);
      console.log(`- City: ${city}`);
      console.log(`- Max Price: ${maxPrice.toLocaleString()} AED`);
      console.log(`- Limit: ${limit}`);
      console.log(`- Query: ${query}`);

      const result = await this.firecrawl.search(query, {
        pageOptions: {
          formats: ["html"],
          screenshot: true,
        },
        searchOptions: {
          limit: Math.floor(limit),
        },
      });

      console.log("🔥 [FirecrawlService] Raw search result:");
      console.log("- Result exists:", !!result);
      console.log("- Has data array:", Array.isArray(result?.data));
      console.log("- Data length:", result?.data?.length || 0);
      console.log("- Full result:", JSON.stringify(result, null, 2));

      if (!result || !Array.isArray(result.data)) {
        console.error(
          "❌ [FirecrawlService] No valid data returned from FireCrawl search."
        );
        return [];
      }

      console.log("🔍 [FirecrawlService] Processing search results...");

      const validUrls = result.data
        .filter((item) => {
          console.log(`🔍 Processing item:`, {
            url: item.url,
            title: item.title,
            hasDescription: !!item.description,
            descriptionPreview: item.description?.substring(0, 100) + "...",
          });

          if (
            !item.title ||
            item.title.includes("Oops") ||
            item.title.includes("can't seem to find")
          ) {
            console.warn(
              `⚠️ [FirecrawlService] Skipping invalid page: ${item.url}`
            );
            return false;
          }

          if (
            !item.description ||
            item.description.includes("can't seem to find")
          ) {
            console.warn(
              `⚠️ [FirecrawlService] Skipping page with invalid description: ${item.url}`
            );
            return false;
          }

          const badPatterns = [
            "squareyards.ae",
            ".png",
            ".jpg",
            "/logo/",
            "/assets/",
          ];

          const hasBadPattern = badPatterns.some((pattern) =>
            item.url.includes(pattern)
          );
          if (hasBadPattern) {
            console.warn(
              `⚠️ [FirecrawlService] Skipping URL with bad pattern: ${item.url}`
            );
          }

          return !hasBadPattern;
        })
        .map((item) => ({
          url: item.url,
          screenshot: item.screenshot,
          description: item.description,
        }));

      console.log(
        `✅ [FirecrawlService] Found ${validUrls.length} valid property listing URLs:`
      );

      // 🔥 OUTPUT THE URLS HERE 🔥
      validUrls.forEach((url, index) => {
        console.log(`[${index + 1}] ${url.url}`);
        console.log(
          `    Description: ${url.description?.substring(0, 150)}...`
        );
      });

      return validUrls;
    } catch (error) {
      console.error("❌ [FirecrawlService] Error in findProperties:", error);
      throw error;
    }
  }

  /**
   * Find and summarize real estate market trends for a given city
   * @param {string} city - City name (e.g., Dubai)
   * @returns {Promise<{success: boolean, message?: string, summary?: string, url?: string, title?: string, warning?: string}>}
   */
  async getCityPriceAnalysis(city) {
    try {
      const query = `What's the real estate market trend of ${city} in UAE?`;
      console.log(`[FirecrawlService] Searching for articles: ${query}`);

      // Search for relevant articles
      const searchResult = await this.firecrawl.search(query, {
        searchOptions: {
          limit: 3, // Get top 3 most relevant articles
        },
      });

      if (
        !searchResult ||
        !Array.isArray(searchResult.data) ||
        searchResult.data.length === 0
      ) {
        throw new Error("No relevant articles found from FireCrawl search.");
      }

      // Log raw search results
      console.log(
        "[FirecrawlService] Raw search results:",
        searchResult.data.map((article) => ({
          url: article.url,
          description: article.description,
        }))
      );

      // Return only description and URL for each article
      const articles = searchResult.data
        .filter((article) => article.url && article.description)
        .map((article) => ({
          url: article.url,
          description: article.description,
        }));

      if (articles.length === 0) {
        throw new Error("No valid articles found in the response.");
      }

      // Log filtered articles
      console.log("[FirecrawlService] Filtered articles:", articles);
      articles.forEach((article, index) => {
        console.log(`\nArticle ${index + 1}:`);
        console.log("URL:", article.url);
        console.log("Description:", article.description);
      });

      return {
        success: true,
        articles,
      };
    } catch (error) {
      console.error(
        "[FirecrawlService] A critical error occurred in getCityPriceAnalysis:",
        error.message
      );
      return {
        success: false,
        message: error.message,
        articles: [],
      };
    }
  }

  /**
   * Scrape and summarize a specific article URL using Playwright and Groq
   * @param {string} url - The article URL to scrape and summarize
   * @returns {Promise<{success: boolean, summary?: string, message?: string}>}
   */
  async getArticleSummaryFromUrl(url) {
    try {
      if (!this._validateUrl(url)) {
        return { success: false, message: "Invalid URL provided." };
      }

      console.log(`[Playwright/Groq] Starting summary for: ${url}`);

      // 1. Launch Browser and Scrape Content
      const browser = await playwright.chromium.launch();
      const context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      });
      const page = await context.newPage();
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      const pageContent = await page.evaluate(() => {
        ["nav", "footer", "aside", "script", "style", ".ad", "iframe"].forEach(
          (selector) => {
            document.querySelectorAll(selector).forEach((el) => el.remove());
          }
        );
        return document.body.innerText;
      });
      await browser.close();

      if (!pageContent || pageContent.trim().length < 200) {
        return {
          success: false,
          message: "Could not retrieve enough content to generate a summary.",
        };
      }

      // 2. Summarize with Groq
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Act as a real estate market analyst. Provide a clear, concise, and professional summary (150–200 words) of the article below. Emphasize key statistics, price trends, and future outlook. Highlight relevant figures (e.g., percentages, price changes, volumes) to support insights. Format key statistics (e.g., percentages, prices, transaction volumes) in bold using Markdown (e.g., **25%**, **$500,000**). Do not include internal reasoning or commentary—present only the final summary, as if writing for a market report",
          },
          {
            role: "user",
            content: `Article content:\n\n"${pageContent.substring(0, 20000)}"`,
          },
        ],
        model: "qwen/qwen3-32b",
      });

      const summary = chatCompletion.choices[0]?.message?.content || "";

      if (!summary) {
        return {
          success: false,
          message: "Failed to generate summary from Groq.",
        };
      }

      // Post-process the summary to remove unwanted meta-commentary
      const cleanedSummary = summary
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/^here is the summary:/i, "")
        .replace(/^thinking:/i, "")
        .replace(/\(Word count: \d+\)/i, "")
        .trim();

      console.log(`[Playwright/Groq] Successfully summarized: ${url}`);
      return { success: true, summary: cleanedSummary };
    } catch (error) {
      console.error(
        `[Playwright/Groq] Failed to process ${url}:`,
        error.message
      );
      return {
        success: false,
        message: `An error occurred while processing the article: ${error.message}`,
      };
    }
  }
}

export default new FirecrawlService();
