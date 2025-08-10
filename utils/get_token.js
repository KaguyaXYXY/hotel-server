import dotenv from "dotenv";
dotenv.config();

const get_token = async () => {
  //API endpoint
  const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
  const data = new URLSearchParams();
  //obtain API key and secret from .env
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
    //return access token from the response data
    return responseData.access_token;
  } catch (error) {
    console.error("Error requesting access token:", error);
    return { error: "An error occurred while requesting the access token." };
  }
};

export { get_token };
