import FirecrawlApp from "@mendable/firecrawl-js";
import { config } from "../config/config.js";

class FirecrawlService {
  constructor() {
    this.firecrawl = new FirecrawlApp({
      apiKey: config.firecrawlApiKey,
    });
    this.requestConfig = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        Referer: "https://www.google.com/",
      },
      timeout: 30000, // 30 second timeout
    };
  }

  // Map propertyType to Bayut URL format
  _mapPropertyTypeToBayutUrl(propertyType) {
    return propertyType.toLowerCase() === "villa" ? "villas" : "apartments";
  }

  // Validate Bayut URL before scraping with enhanced error handling
  async _validateBayutUrl(url) {
    try {
      // Normalize URL format
      let normalizedUrl = url;
      if (!url.startsWith("http")) {
        normalizedUrl = `https://${url}`;
      }
      if (!normalizedUrl.includes("www.")) {
        normalizedUrl = normalizedUrl.replace("://", "://www.");
      }

      const result = await this.firecrawl.scrapeUrl({
        url: normalizedUrl,
        options: {
          ...this.requestConfig,
          waitForSelector: "body",
          onlyMainContent: false,
          waitUntil: "domcontentloaded",
        },
      });

      const html = result.data?.content || "";

      // Check for various blocking scenarios
      const isBlocked = [
        "Oops! Sorry, This section is no longer available",
        "Access Denied",
        "captcha",
        "Cloudflare",
      ].some((term) => html.includes(term));

      if (isBlocked) {
        console.warn(
          `[FirecrawlService] URL blocked by Bayut: ${normalizedUrl}`
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error(`[FirecrawlService] URL validation failed for ${url}:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return false;
    }
  }

  // Enhanced property extraction with retry logic
  async findProperties(
    city,
    maxPrice,
    propertyCategory = "Residential",
    propertyType = "Flat",
    limit = 6,
    retryCount = 2
  ) {
    let searchUrl;
    let lastError = null;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const formattedCity = encodeURIComponent(
          city.toLowerCase().replace(/\s+/g, "-")
        );
        const emirate = "dubai";

        // Construct URL based on property type
        if (propertyCategory === "Commercial") {
          searchUrl = `https://www.bayut.com/for-sale/commercial/${emirate}/${formattedCity}/`;
        } else {
          switch (propertyType.toLowerCase()) {
            case "villa":
              searchUrl = `https://www.bayut.com/for-sale/villas/${emirate}/${formattedCity}/`;
              break;
            case "penthouse":
              searchUrl = `https://www.bayut.com/for-sale/penthouses/${emirate}/${formattedCity}/`;
              break;
            default: // Includes 'flat' and 'apartment'
              searchUrl = `https://www.bayut.com/for-sale/property/${emirate}/${formattedCity}/`;
          }
        }

        console.log(
          `[FirecrawlService] Attempt ${attempt + 1}: Searching ${searchUrl}`
        );

        // Validate URL before proceeding
        const isUrlValid = await this._validateBayutUrl(searchUrl);
        if (!isUrlValid) {
          throw new Error(`URL validation failed for ${searchUrl}`);
        }

        // Define schema for property extraction
        const propertySchema = {
          type: "object",
          properties: {
            properties: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  price: {
                    type: "string",
                    selector: "h4._0e3d05b8 .dc381b54",
                    transform: (value) => `AED ${value.trim()}`,
                  },
                  property_type: {
                    type: "string",
                    selector: "span[aria-label='Type']",
                  },
                  beds: {
                    type: "string",
                    selector:
                      "span[aria-label='Studio'], span[aria-label='Beds']",
                  },
                  baths: {
                    type: "string",
                    selector: "span[aria-label='Baths']",
                  },
                  area_sqft: {
                    type: "string",
                    selector: "span[aria-label='Area'] h4",
                  },
                  title: {
                    type: "string",
                    selector: "h2[aria-label='Title']",
                  },
                  location: {
                    type: "string",
                    selector: "h3._4402bd70",
                  },
                },
                required: ["price", "property_type", "title"],
              },
            },
          },
        };

        // Perform the extraction
        const extractResult = await this.firecrawl.extract({
          url: searchUrl,
          extractor: {
            mode: "llm-extraction",
            schema: propertySchema,
          },
          options: {
            ...this.requestConfig,
            waitForSelector: "span[aria-label='Area']",
            waitUntil: "networkidle2",
          },
        });

        console.log("[FirecrawlService] Extraction result received");

        if (!extractResult?.success || !extractResult.data?.properties) {
          throw new Error("No properties found in extraction result");
        }

        // Filter and format results
        const filteredProperties = extractResult.data.properties
          .filter((p) => {
            try {
              const priceValue =
                parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0;
              return priceValue <= maxPrice * 1e6;
            } catch (e) {
              console.warn("[FirecrawlService] Error parsing price:", p.price);
              return false;
            }
          })
          .slice(0, limit);

        return {
          properties: filteredProperties,
          analysis: this._generateAnalysis(filteredProperties, city, maxPrice),
        };
      } catch (error) {
        lastError = error;
        console.warn(
          `[FirecrawlService] Attempt ${attempt + 1} failed:`,
          error.message
        );

        // Add delay before retry (exponential backoff)
        if (attempt < retryCount) {
          const delayMs = 2000 * Math.pow(2, attempt);
          console.log(`[FirecrawlService] Retrying in ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    // All retries failed
    console.error("[FirecrawlService] All attempts failed:", lastError);
    return {
      properties: [],
      message: "Failed to fetch properties after multiple attempts",
      error: lastError.message,
    };
  }

  // Enhanced price trends extraction
  async getCityPriceAnalysis(city, propertyType = "Flat", retryCount = 1) {
    let lastError = null;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const formattedCity = encodeURIComponent(
          city.toLowerCase().replace(/\s+/g, "-")
        );
        const bayutPropertyType = this._mapPropertyTypeToBayutUrl(propertyType);
        const trendsUrl = `https://www.bayut.com/index/sale-prices-${bayutPropertyType}-${formattedCity}.html`;

        // Validate URL with fallback to Dubai-wide trends
        const finalUrl = (await this._validateBayutUrl(trendsUrl))
          ? trendsUrl
          : `https://www.bayut.com/index/sale-prices-${bayutPropertyType}-dubai.html`;

        console.log(`[FirecrawlService] Using price trends URL: ${finalUrl}`);

        const priceTrendSchema = {
          type: "object",
          properties: {
            location_name: {
              type: "string",
              selector: "h3._4402bd70",
              transform: "value => value.textContent.trim()",
            },
            current_price_per_sqft: {
              type: "string",
              selector: ".price-class",
              transform: "value => value.textContent.replace(/[^0-9.]/g, '')",
            },
            historical_prices: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  month_year: {
                    type: "string",
                    selector: "li.left:nth-child(1)",
                  },
                  price_per_sqft_table: {
                    type: "string",
                    selector: "li.left:nth-child(3)",
                    transform:
                      "value => value.textContent.replace(/[^0-9.]/g, '')",
                  },
                  percentage_change: {
                    type: "string",
                    selector: "li.left.inc, li.left.dec",
                    transform: "value => value.textContent.trim()",
                  },
                },
              },
              selector: ".toogling-section li:not(.col-name)",
            },
          },
          required: ["location_name", "current_price_per_sqft"],
        };

        const extractResult = await this.firecrawl.extract({
          url: finalUrl,
          extractor: {
            mode: "llm-extraction",
            schema: priceTrendSchema,
          },
          options: {
            ...this.requestConfig,
            waitForSelector: ".toogling-section",
          },
        });

        if (!extractResult?.success || !extractResult.data) {
          throw new Error(extractResult.error || "No price trend data found");
        }

        // Validate location matches
        const extractedLocation = extractResult.data.location_name || "";
        const expectedLocation = city.trim().toLowerCase();

        if (!extractedLocation.toLowerCase().includes(expectedLocation)) {
          console.warn(
            `Extracted trends for "${extractedLocation}" instead of "${city}"`
          );
          return {
            success: false,
            message: `Data mismatch: Trends for "${extractedLocation}" not "${city}"`,
            detailedPriceTrend: null,
          };
        }

        return {
          success: true,
          detailedPriceTrend: extractResult.data,
        };
      } catch (error) {
        lastError = error;
        console.warn(
          `[FirecrawlService] Price trends attempt ${attempt + 1} failed:`,
          error.message
        );

        if (attempt < retryCount) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    return {
      success: false,
      message: "Failed to fetch price trends",
      error: lastError?.message,
    };
  }

  // Debug/test function to check Firecrawl API with a public URL (string-based call)
  async testScrapeUrl() {
    const testUrl = 'https://example.com';
    try {
      console.log('[FirecrawlService] Testing scrapeUrl with (string call):', testUrl);
      const result = await this.firecrawl.scrapeUrl(testUrl);
      console.log('[FirecrawlService] scrapeUrl result:', result);
      return result;
    } catch (error) {
      console.error('[FirecrawlService] scrapeUrl test error (string call):', error.message, error.response?.data);
      return null;
    }
  }

  // Generate comprehensive analysis
  _generateAnalysis(properties, city, maxPrice) {
    if (properties.length === 0) {
      return `No properties found in ${city} within AED ${maxPrice.toLocaleString()} budget.`;
    }

    const priceStats = properties.reduce(
      (stats, p) => {
        const price = parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0;
        stats.total += price;
        stats.min = Math.min(stats.min, price);
        stats.max = Math.max(stats.max, price);
        return stats;
      },
      { total: 0, min: Infinity, max: 0 }
    );

    const avgPrice = priceStats.total / properties.length;
    const priceRange =
      priceStats.min === priceStats.max
        ? `AED ${priceStats.min.toLocaleString()}`
        : `AED ${priceStats.min.toLocaleString()} - AED ${priceStats.max.toLocaleString()}`;

    const types = [...new Set(properties.map((p) => p.property_type))];
    const typeSummary =
      types.length > 1
        ? `${types.length} property types (${types.join(", ")})`
        : types[0];

    return {
      summary: `Found ${properties.length} properties in ${city}`,
      priceAnalysis: {
        average: `AED ${Math.round(avgPrice).toLocaleString()}`,
        range: priceRange,
        budgetComparison: `Your budget: AED ${maxPrice.toLocaleString()}`,
      },
      propertyTypes: typeSummary,
      recommendation: this._generateRecommendation(
        properties.length,
        avgPrice,
        maxPrice
      ),
    };
  }

  _generateRecommendation(count, avgPrice, maxPrice) {
    if (count === 0) return "Consider expanding your search area or budget.";

    const budgetRatio = maxPrice / avgPrice;
    if (budgetRatio > 1.5) {
      return "Your budget is significantly above average. You can find premium properties.";
    } else if (budgetRatio < 0.8) {
      return "Your budget is below average. Consider increasing it or looking at smaller properties.";
    }
    return "Your budget aligns well with the market average.";
  }
}

export default new FirecrawlService();
