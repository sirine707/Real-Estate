import { Helmet } from 'react-helmet-async';

const AiHubSEO = () => {
  return (
    <Helmet>
      <title>Aqarat AI | EmiratEstate - Market Trends & Property Analysis</title>
      <meta name="description" content="Use EmiratEstate's Aqarat AI to analyze real estate trends, compare property values, and get location-specific investment insights powered by advanced AI." />
      <meta name="keywords" content="AI property analysis, real estate trends, property investment, rental yield, location trends, property appreciation, Mumbai real estate data, Delhi property market, Bangalore housing trends" />
      
      {/* Enhanced social sharing */}
      <meta property="og:title" content="Aqarat AI | EmiratEstate" />
      <meta property="og:description" content="AI-powered property analysis and location trends for smarter real estate decisions." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://EmiratEstate.vercel.app/ai-property-hub" />
      
      {/* Local availability note for crawlers */}
      <meta name="robots" content="index, follow" />
      <meta name="availability" content="Demo features available in local environment. Download repository for full functionality." />
    </Helmet>
  );
};

export default AiHubSEO;