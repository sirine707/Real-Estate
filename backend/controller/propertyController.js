import firecrawlService from '../services/firecrawlService.js';
import aiService from '../services/aiService.js';
import Property from '../models/propertymodel.js'; // Import the Property model

export const searchProperties = async (req, res) => {
    try {
        const { city, maxPrice, propertyCategory, propertyType, limit = 6 } = req.body;

        if (!city || !maxPrice) {
            return res.status(400).json({ success: false, message: 'City and maxPrice are required' });
        }

        // Extract property data using Firecrawl, specifying the limit
        const propertiesData = await firecrawlService.findProperties(
            city, 
            maxPrice, 
            propertyCategory || 'Residential',
            propertyType || 'Flat',
            Math.min(limit, 6) // Limit to max 6 properties
        );

        // Analyze the properties using AI
        const analysis = await aiService.analyzeProperties(
            propertiesData.properties,
            city,
            maxPrice,
            propertyCategory || 'Residential',
            propertyType || 'Flat'
        );

        res.json({
            success: true,
            properties: propertiesData.properties,
            analysis
        });
    } catch (error) {
        console.error('Error searching properties:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to search properties',
            error: error.message
        });
    }
};

// Renamed from getLocationTrends to getCityPriceAnalysis
export const getCityPriceAnalysis = async (req, res) => {
    try {
        const { city } = req.params;

        if (!city) {
            return res.status(400).json({ success: false, message: 'City parameter is required' });
        }

        // Fetches raw price trend data (current and historical)
        // Calls the renamed service method
        const rawPriceTrendData = await firecrawlService.getCityPriceAnalysis(city);

        // Analyzes the fetched price trend data
        // aiService.analyzeLocationTrends might need to be renamed to aiService.analyzePriceTrends for consistency,
        // but we'll assume it correctly processes the rawPriceTrendData.price_trend object.
        // The name of the AI service method is kept as analyzeLocationTrends for now, as its internal prompt
        // is more about general location/trend analysis rather than just raw price numbers.
        const priceTrendAnalysis = await aiService.analyzeLocationTrends( 
            rawPriceTrendData.price_trend, 
            city
        );

        res.json({
            success: true,
            detailedPriceTrend: rawPriceTrendData.price_trend, // Contains current/historical prices
            analysis: priceTrendAnalysis, // Contains the AI's textual analysis of the trends
        });
    } catch (error) {
        console.error('Error getting city price analysis:', error); // Updated error message
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get city price analysis', // Updated error message
            error: error.message
        });
    }
};

// New function to get all properties
export const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find({}); // Fetch all properties
        res.json({
            success: true,
            properties
        });
    } catch (error) {
        console.error('Error fetching all properties:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch all properties',
            error: error.message
        });
    }
};

// New function to get properties by filters (availability and location)
export const getPropertiesByFilters = async (req, res) => {
    try {
        const { type, location } = req.query;
        const mongoQuery = {};

        if (location) {
            mongoQuery.location = new RegExp(location, 'i'); // Case-insensitive search
        }

        if (type) {
            if (type.toLowerCase() === 'buy') {
                mongoQuery.availability = 'For Sale';
            } else if (type.toLowerCase() === 'rent') {
                mongoQuery.availability = 'For Rent';
            }
            // If type is something else or not provided, it won't filter by availability unless specified
        }

        const properties = await Property.find(mongoQuery);
        
        res.json({
            success: true,
            properties
        });

    } catch (error) {
        console.error('Error fetching properties by filters:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch properties by filters',
            error: error.message
        });
    }
};

// Debug route to test Firecrawl API with https://example.com
export const testFirecrawl = async (req, res) => {
    try {
        const result = await firecrawlService.testScrapeUrl();
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Test failed', error: error.message });
    }
};