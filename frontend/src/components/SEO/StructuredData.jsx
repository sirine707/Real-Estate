import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const StructuredData = ({ type, data }) => {
  const location = useLocation();
  const currentUrl = `https://EmiratEstate.vercel.app${location.pathname}`;

  // Different schema types based on page content
  const schemas = {
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "EmiratEstate",
      url: "https://EmiratEstate.vercel.app",
      potentialAction: {
        "@type": "SearchAction",
        target: "{search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "EmiratEstate",
      url: "https://EmiratEstate.vercel.app",
      logo: "https://EmiratEstate.vercel.app/logo.png",
      sameAs: [
        "https://github.com/sirine707/Real-Estate",
        "https://linkedin.com/in/sirine-jnayeh",
      ],
    },
    property: {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: data?.title || "Property Listing",
      description: data?.description || "Property details",
      url: currentUrl,
      datePosted: data?.createdAt || new Date().toISOString(),
      address: {
        "@type": "PostalAddress",
        addressLocality: data?.location || "City",
        addressRegion: data?.region || "Region",
        addressCountry: "IN",
      },
      price: data?.price ? `DH ${data.price}` : "",
      floorSize: {
        "@type": "QuantitativeValue",
        unitText: "SQFT",
        value: data?.sqft || "",
      },
      numberOfRooms: data?.beds || "",
      numberOfBathroomsTotal: data?.baths || "",
    },
    aiHub: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Aqarat AI",
      applicationCategory: "RealEstateApplication",
      description: "AI-powered real estate analytics and recommendations tool",
      url: "https://EmiratEstate.vercel.app/ai-property-hub",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    },
  };

  const schemaData = schemas[type] || schemas.website;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

StructuredData.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object,
};

export default StructuredData;
