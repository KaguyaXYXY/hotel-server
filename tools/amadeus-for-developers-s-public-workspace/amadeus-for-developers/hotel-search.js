import { get_token } from "../../../utils/get_token.js";
/**
 * Function to search for hotels and retrieve availability and rates information.
 *
 * @param {Object} args - Arguments for the hotel search.
 * @param {string} args.hotelIds - The IDs of the hotels to search for.
 * @param {number} [args.adults=1] - The number of adults for the search.
 * @returns {Promise<Object>} - The result of the hotel search.
 */
const executeFunction = async ({
  hotelIds,
  adults = 1,
  checkInDate = undefined,
  checkOutDate = undefined,
  priceRange = undefined,
  roomQuantity = 1,
}) => {
  const baseUrl = "https://test.api.amadeus.com";
  const token = await get_token();
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v3/shopping/hotel-offers`);
    url.searchParams.append("hotelIds", hotelIds);
    url.searchParams.append("adults", adults.toString());
    if (checkInDate) {
      url.searchParams.append("checkInDate", checkInDate);
    }
    if (checkOutDate) {
      url.searchParams.append("checkOutDate", checkOutDate);
    }
    if (priceRange) {
      url.searchParams.append("priceRange", priceRange);
    }
    url.searchParams.append("roomQuantity", roomQuantity);
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
    const offer = await response.json();
    const offer_data = offer.data[0];
    //include hotel name, offer id, availability, check in and check out date, room description, price and policies in result
    const offer_list = [];
    for (let x in offer_data.offers) {
      const result_x = {
        hotelName: offer_data.hotel.name,
        available: offer_data.available,
        offerId: offer_data.offers[x].id,
        checkInDate: offer_data.offers[x].checkInDate,
        checkOutDate: offer_data.offers[x].checkOutDate,
        description: offer_data.offers[x].room.description.text,
        price:
          offer_data.offers[x].price.total +
          offer_data.offers[x].price.currency,
        policies: offer_data.offers[x].policies,
      };
      offer_list.push(result_x);
    }
    return offer_list;
  } catch (error) {
    console.error("Error searching for hotels:", error);
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
 * Tool configuration for searching hotels.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: "function",
    function: {
      name: "hotel_search",
      description:
        "Search for hotels and retrieve availability and rates information.",
      parameters: {
        type: "object",
        properties: {
          hotelIds: {
            type: "string",
            description: "The IDs of the hotels to search for.",
          },
          adults: {
            type: "integer",
            description: "The number of adults for the search.",
          },
          checkInDate: {
            type: "string",
            format: "date",
            description:
              "The check-in date for the hotel stay, formatted as 'YYYY-MM-DD'.",
          },
          checkOutDate: {
            type: "string",
            format: "date",
            description:
              "The check-out date for the hotel stay, formatted as 'YYYY-MM-DD'.",
          },
          priceRange: {
            type: "string",
            description:
              "The price range for the hotel search, formatted as 'min-max'.",
          },
          roomQuantity: {
            type: "integer",
            description: "The number of rooms to book.",
            default: 1,
          },
        },
        required: ["hotelIds"],
      },
    },
  },
};

export { apiTool };
