import { get_token } from "../../../utils/get_token.js";
/**
 * Function to retrieve a list of hotels by city from the Amadeus API.
 *
 * @param {Object} args - Arguments for the hotel search.
 * @param {string} args.cityCode - The city code for which to retrieve hotel information.
 * @param {number} [args.radius=5] - Maximum distance from the geographical coordinates in kilometers.
 * @param {string} [args.radiusUnit='KM'] - Unit of measurement for the radius.
 * @param {string} [args.hotelSource='ALL'] - Source of the hotels to retrieve.
 * @returns {Promise<Object>} - The result of the hotel search.
 */
const executeFunction = async ({
  cityCode,
  radius = 5,
  radiusUnit = "KM",
  hotelSource = "ALL",
  chainCode = undefined,
  amenities = undefined,
  rating = undefined,
}) => {
  const baseUrl = "https://test.api.amadeus.com";
  const token = await get_token();
  try {
    // Construct the URL with query parameters
    const url = new URL(
      `${baseUrl}/v1/reference-data/locations/hotels/by-city`
    );
    url.searchParams.append("cityCode", cityCode);
    url.searchParams.append("radius", radius.toString());
    url.searchParams.append("radiusUnit", radiusUnit);
    url.searchParams.append("hotelSource", hotelSource);
    if (chainCode) {
      url.searchParams.append("chainCodes", chainCode);
    }
    if (amenities) {
      url.searchParams.append("amenities", amenities);
    }
    if (rating) {
      url.searchParams.append("ratings", rating);
    }
    // Set up headers for the request
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData, null, 2));
    }

    // Parse and return the response data
    const all_hotel = await response.json();
    const all_hotel_data = all_hotel.data;
    const filtered_hotel_data = [];
    for (let hotel of all_hotel_data) {
      //process hotel address
      let address_format = "";
      // Check if address exists at all
      if (hotel.address) {
        // Check if lines exist and are an array
        if (hotel.address.lines && Array.isArray(hotel.address.lines)) {
          // Join all address lines
          for (let x in hotel.address.lines) {
            address_format += hotel.address.lines[x] + ", ";
          }
        }

        // Add city name if it exists
        if (hotel.address.cityName) {
          address_format += hotel.address.cityName;
        }

        // Add postal code if it exists
        if (hotel.address.postalCode) {
          if (hotel.address.cityName) {
            address_format += ", ";
          }
          address_format += hotel.address.postalCode;
        }

        // If we still have no address and the address is a string, use it
        if (!address_format && typeof hotel.address === "string") {
          address_format = hotel.address;
        }
      }

      // Clean up trailing comma and space
      address_format = address_format.replace(/,\s*$/, "");
      //returning the filtered data from the first output
      const first_hotel_data = {
        name: hotel.name,
        hotelId: hotel.hotelId,
        address: address_format,
        rating: hotel.rating,
      };
      filtered_hotel_data.push(first_hotel_data);
    }
    return filtered_hotel_data;
  } catch (error) {
    console.error("Error retrieving hotel list:", error);
    return {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : error,
    };
  }
};

/**
 * Tool configuration for retrieving a list of hotels by city from the Amadeus API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: "function",
    function: {
      name: "hotel_list_by_city",
      description: "Retrieve a list of hotels by city from the Amadeus API.",
      parameters: {
        type: "object",
        properties: {
          cityCode: {
            type: "string",
            description:
              "The city code for which to retrieve hotel information.",
          },
          radius: {
            type: "number",
            description:
              "Maximum distance from the geographical coordinates in kilometers.",
          },
          radiusUnit: {
            type: "string",
            enum: ["KM", "MI"],
            description: "Unit of measurement for the radius.",
          },
          hotelSource: {
            type: "string",
            description: "Source of the hotels to retrieve.",
          },
          chainCode: {
            type: "string",
            description: "Filter hotels by chain code.",
          },
          amenities: {
            type: "string",
            description: "Filter hotels by amenities.",
          },
          rating: {
            type: "string",
            description: "Filter hotels by rating.",
          },
        },
        required: ["cityCode"],
      },
    },
  },
};

export { apiTool };
