import PropTypes from "prop-types";

const PropertyCard = ({ property, city }) => {
  const { url, description } = property;

  if (!description || description.startsWith("Missing")) {
    return null;
  }

  // Format city for matching (case-insensitive, trimmed, no extra spaces)
  const formattedCity = city ? city.trim().replace(/\s+/g, " ") : "";
  let displayDescription = description;
  if (formattedCity) {
    // Find the last occurrence of the city name (case-insensitive)
    const regex = new RegExp(`(.+?${formattedCity}\.)`, "i");
    const match = description.match(regex);
    if (match) {
      displayDescription = match[1];
    }
  }

  return (
    <li className="mb-4">
      <p className="text-lg text-gray-700">📍 {displayDescription}</p>
      <span className="text-lg">👉 Check this website: </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg text-blue-500 hover:underline"
      >
        {url}
      </a>
    </li>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    url: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  city: PropTypes.string,
};

export default PropertyCard;
