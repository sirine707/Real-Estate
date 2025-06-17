import express from 'express';
import { searchProperties, getCityPriceAnalysis, getAllProperties, getPropertiesByFilters } from '../controller/propertyController.js';

const router = express.Router();

// Route to search for properties
router.post('/properties/search', searchProperties);

// Route to get location trends - Path updated for clarity
router.get('/locations/:city/price-analysis', getCityPriceAnalysis);

// New route to get all properties or filter by availability and location
router.get('/properties', getPropertiesByFilters);

// Route to get all properties
router.get('/properties/all', getAllProperties);

export default router;