import FirecrawlApp from "@mendable/firecrawl-js";
import { config } from '../config/config.js';

class FirecrawlService {
  constructor() {
    this.firecrawl = new FirecrawlApp({
      apiKey: config.firecrawlApiKey
    });
  }

  // ✅ Map propertyType to Bayut URL format
  _mapPropertyTypeToBayutUrl(propertyType) {
    return propertyType.toLowerCase() === 'villa' ? 'villas' : 'apartments';
  }

  // ✅ Validate Bayut URL before scraping
  async _validateBayutUrl(url) {
    try {
      const result = await this.firecrawl.scrapeUrl(url);
      const html = result.data?.content || '';
      // Check for known error content
      if (html.includes("Oops! Sorry, This section is no longer available")) {
        console.warn(`[FirecrawlService] Bayut URL is invalid: ${url}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error(`[FirecrawlService] Error validating URL ${url}:`, error.message);
      return false;
    }
  }

  // ✅ Extract property listings from Bayut
  async findProperties(city, maxPrice, propertyCategory = "Residential", propertyType = "Flat", limit = 6) {
    try {
      const formattedCity = city.toLowerCase().replace(/\s+/g, '-');
      const emirate = "dubai";
      const bayutPropertyType = this._mapPropertyTypeToBayutUrl(propertyType);
      const searchUrl = `https://www.bayut.com/for-sale/property/${emirate}/${formattedCity}/`; 

      // ✅ Schema for property listings
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
                  selector: ".dc381b54", 
                  transform: "value => value.textContent.replace(/[^0-9.,]/g, '')"
                },
                property_type: { 
                  type: "string", 
                  selector: "._19e94678.e0abc2de:nth-of-type(1)", 
                  transform: "value => value.textContent.trim()"
                },
                beds: { 
                  type: "string", 
                  selector: "._19e94678.e0abc2de:nth-of-type(2)", 
                  transform: "value => value.textContent.trim()"
                },
                baths: { 
                  type: "string", 
                  selector: "._19e94678.e0abc2de:nth-of-type(3)", 
                  transform: "value => value.textContent.trim()"
                },
                area_sqft: { 
                  type: "string", 
                  selector: ".cfac7e1b._85ddb82f", 
                  transform: "value => value.textContent.trim()"
                },
                title: { 
                  type: "string", 
                  selector: ".f0f13906" 
                },
                location_address: { 
                  type: "string", 
                  selector: "._4402bd70" 
                },
                agency_name: { 
                  type: "string", 
                  selector: ".a8593e2b[title]", 
                  transform: "value => value.getAttribute('title')"
                },
                handover_date: { 
                  type: "string", 
                  selector: ".f1022a12._371e9918" 
                },
                payment_plan: { 
                  type: "string", 
                  selector: ".f1022a12._4b56adba" 
                },
                description: { 
                  type: "string", 
                  selector: "._9e0180f9" 
                },
                amenities: { 
                  type: "array", 
                  items: { type: "string" },
                  selector: "._19e94678.e0abc2de" 
                }
              },
              required: ["price", "property_type", "beds", "baths", "area_sqft", "title", "location_address"]
            }
          }
        },
        required: ["properties"]
      };

      // ✅ Firecrawl v1 API call
      const extractResult = await this.firecrawl.extract({
        url: searchUrl,
        extractorOptions: {
          mode: 'llm-extraction',
          prompt: `Extract ONLY ${limit} properties in ${city}, UAE under AED ${maxPrice}M. Include price, type, bedrooms, bathrooms, area, title, location, and agency.`,
          schema: propertySchema
        }
      });

      if (!extractResult?.success || !extractResult.data?.properties) {
        console.error(`[FirecrawlService] Failed to extract properties for ${city}:`, extractResult.error || 'No properties found');
        return { properties: [], message: extractResult.error || 'No properties found' };
      }

      // ✅ Filter by maxPrice (convert AED to number)
      const filteredProperties = extractResult.data.properties
        .filter(p => {
          const priceValue = parseFloat(p.price.replace(/[^0-9.]/g, ''));
          return priceValue <= maxPrice * 1e6;
        })
        .slice(0, limit);

      return { properties: filteredProperties };
    } catch (error) {
      console.error(`[FirecrawlService] Error finding properties for ${city}:`, error.message);
      return { properties: [], message: error.message };
    }
  }

  // ✅ Extract price trends from Bayut
  async getCityPriceAnalysis(city, propertyType = "Flat") {
    try {
      const formattedCity = city.toLowerCase().replace(/\s+/g, '-');
      const bayutPropertyType = this._mapPropertyTypeToBayutUrl(propertyType);
      // ✅ Use Dubai as fallback
      const trendsUrl = `https://www.bayut.com/index/sale-prices-${bayutPropertyType}-${formattedCity}.html`; 
      const finalUrl = await this._validateBayutUrl(trendsUrl) ? trendsUrl : `https://www.bayut.com/index/sale-prices-${bayutPropertyType}-dubai.html`; 

      // ✅ Schema for price trends
      const priceTrendSchema = {
        type: "object",
        properties: {
          location_name: { 
            type: "string", 
            selector: "h3._4402bd70", 
            transform: "value => value.textContent.trim()"
          },
          current_price_per_sqft: { 
            type: "string", 
            selector: ".price-class", 
            transform: "value => value.textContent.replace(/[^0-9.]/g, '')"
          },
          historical_prices: {
            type: "array",
            items: {
              type: "object",
              properties: {
                month_year: { 
                  type: "string", 
                  selector: "li.left:nth-child(1)",
                  transform: "value => value.textContent.trim()"
                },
                price_per_sqft_table: { 
                  type: "string", 
                  selector: "li.left:nth-child(3)",
                  transform: "value => value.textContent.replace(/[^0-9.]/g, '')"
                },
                percentage_change: { 
                  type: "string", 
                  selector: "li.left.inc, li.left.dec", 
                  transform: "value => value.textContent.trim()" 
                }
              }
            },
            selector: ".toogling-section li:not(.col-name)"
          },
          price_change_direction: { 
            type: "string", 
            selector: ".price.ltr",
            transform: "value => value.classList.contains('dec') ? 'down' : 'up'"
          },
          price_change_value: { 
            type: "string", 
            selector: ".price_value",
            transform: "value => value.textContent.trim()"
          },
          price_change_percentage_summary: { 
            type: "string", 
            selector: ".unit",
            transform: "value => value.textContent.trim()"
          },
          price_change_period: { 
            type: "string", 
            selector: ".sub-title",
            transform: "value => value.textContent.match(/$.*$/)?.[0] || 'N/A'"
          }
        },
        required: ["location_name", "current_price_per_sqft", "historical_prices", "price_change_direction"]
      };

      // ✅ Firecrawl v1 API call
      const extractResult = await this.firecrawl.extract({
        url: finalUrl,
        extractorOptions: {
          mode: 'llm-extraction',
          prompt: `Extract price trends for '${city}' from Bayut. Ensure "location_name" matches '${city}' exactly. Focus on:\n- Current price per sqft\n- Historical price data (month/year, price/sqft, % change)\n- Price change summary (period, value, direction)`,
          schema: priceTrendSchema
        }
      });

      if (!extractResult?.success || !extractResult.data) {
        console.error(`[FirecrawlService] Failed to extract price trends for ${city}:`, extractResult.error || 'No data found');
        return { 
          success: false, 
          message: `Failed to extract price trends for ${city}`, 
          detailedPriceTrend: null 
        };
      }

      // ✅ Validate location matches input
      const extractedLocation = extractResult.data.location_name || '';
      const expectedLocation = city.trim().toLowerCase();

      if (!extractedLocation.toLowerCase().includes(expectedLocation)) {
        console.warn(`[FirecrawlService] Extracted location "${extractedLocation}" does not match expected "${city}"`);
        return {
          success: false,
          message: `Data mismatch: Extracted price trends for "${extractedLocation}" instead of "${city}"`,
          detailedPriceTrend: null
        };
      }

      return {
        success: true,
        detailedPriceTrend: extractResult.data
      };
    } catch (error) {
      console.error(`[FirecrawlService] Error in getCityPriceAnalysis for ${city}:`, error.message);
      // ✅ Diagnostic scrape for 400 errors
      if (error.statusCode === 500 && error.details?.[0]?.code === 'unrecognized_keys') {
        console.warn(`[FirecrawlService] Diagnostic scrape for ${finalUrl}`);
        try {
          const diagnosticScrape = await this.firecrawl.scrapeUrl(finalUrl);
          console.log(`[FirecrawlService] Diagnostic scrape result for ${finalUrl}:`, diagnosticScrape);
        } catch (scrapeError) {
          console.error(`[FirecrawlService] Diagnostic scrape failed for ${finalUrl}:`, scrapeError.message);
        }
      }
      return {
        success: false,
        message: error.message,
        detailedPriceTrend: null
      };
    }
  }
}

export default new FirecrawlService();