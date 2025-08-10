import dotenv from "dotenv";
dotenv.config();
/**
 * Function to request an access token from the Amadeus API using client credentials.
 *
 * @param {Object} args - Arguments for the token request.
 * @param {string} args.client_id - The client ID for the Amadeus API.
 * @param {string} args.client_secret - The client secret for the Amadeus API.
 * @returns {Promise<Object>} - The response containing the access token or an error.
 */
const executeFunction = async ({ client_id, client_secret }) => {
  const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
  const data = new URLSearchParams();
  data.append(
    "client_id",
    process.env.AMADEUS_FOR_DEVELOPERS_S_PUBLIC_WORKSPACE_API_KEY
  );
  data.append("client_secret", process.env.API_secret);
  data.append("grant_type", "client_credentials");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error requesting access token:", error);
    return { error: "An error occurred while requesting the access token." };
  }
};

/**
 * Tool configuration for requesting an access token from the Amadeus API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: "function",
    function: {
      name: "request_access_token",
      description:
        "Request an access token from the Amadeus API using client credentials.",
      parameters: {
        type: "object",
        properties: {
          client_id: {
            type: "string",
            description: "The client ID for the Amadeus API.",
          },
          client_secret: {
            type: "string",
            description: "The client secret for the Amadeus API.",
          },
        },
        required: ["client_id", "client_secret"],
      },
    },
  },
};

export { apiTool };
