import { get_token } from "../../../utils/get_token.js";
/**
 * Function to book a hotel using Amadeus API.
 *
 * @param {Object} args - Arguments for the hotel booking.
 * @param {Array} args.guests - List of guests for the hotel booking.
 * @param {string} args.hotelOfferId - The hotel offer ID to book.
 * @param {string} args.cardVendorCode - Credit Card Vendor Code for the booking.
 * @param {string} args.cardNumber - Credit Card Number for the booking.
 * @param {string} args.expiryDate - Expiry date of the credit card in "YYYY-MM" format.
 * @param {string} args.holderName - Name of the cardholder.
 * @returns {Promise<Object>} - The result of the hotel booking.
 */
const executeFunction = async ({
  guests,
  hotelOfferId,
  cardVendorCode,
  cardNumber,
  expiryDate,
  holderName,
}) => {
  const url = "https://test.api.amadeus.com/v2/booking/hotel-orders";
  const token = await get_token();
  const guestsFormatted = guests.map((guest, index) => ({
    tid: index + 1,
    title: guest.title,
    firstName: guest.firstName,
    lastName: guest.lastName,
    phone: guest.phone,
    email: guest.email,
  }));

  const requestBody = {
    data: {
      type: "hotel-order",
      guests: guestsFormatted,
      travelAgent: {
        contact: {
          email: guests[0].email, // Assuming the first guest's email is used for the travel agent contact
        },
      },
      roomAssociations: [
        {
          guestReferences: [{ guestReference: "1" }],
          hotelOfferId,
        },
      ],
      payment: {
        method: "CREDIT_CARD",
        paymentCard: {
          paymentCardInfo: {
            vendorCode: cardVendorCode,
            cardNumber: cardNumber,
            expiryDate: expiryDate,
            holderName: holderName,
          },
        },
      },
    },
  };

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData, null, 2));
    }

    const booking_confirmation = await response.json();
    const bc_data = booking_confirmation.data;
    //return booking status, confirmation number and reference
    const bc_list = [];
    for (let x in bc_data.hotelBookings) {
      const result_x = {
        bookingStatus: bc_data.hotelBookings[x].bookingStatus,
        confirmationNumber:
          bc_data.hotelBookings[x].hotelProviderInformation[0]
            .confirmationNumber,
        hotelOfferDetails: bc_data.hotelBookings[x].hotelOffer,
      };
      bc_list.push(result_x);
    }
    const result = {
      bookingConfirmationList: bc_list,
      reference: bc_data.associatedRecords[0].reference,
    };
    return result;
  } catch (error) {
    console.error("Error booking hotel:", error);
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
 * Tool configuration for hotel booking using Amadeus API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: "function",
    function: {
      name: "book_hotel",
      description: "Book a hotel using Amadeus API.",
      parameters: {
        type: "object",
        properties: {
          guests: {
            type: "array",
            description: "List of guests for the hotel booking.",
            items: {
              type: "object",
              properties: {
                title: { type: "string", description: "Guest's title" },
                firstName: {
                  type: "string",
                  description: "Guest's first name",
                },
                lastName: { type: "string", description: "Guest's last name" },
                phone: { type: "string", description: "Guest's phone number" },
                email: { type: "string", description: "Guest's email" },
              },
              required: ["title", "firstName", "lastName", "phone", "email"],
            },
          },
          hotelOfferId: {
            type: "string",
            description: "The hotel offer ID to book.",
          },
          cardVendorCode: {
            type: "string",
            description: "Credit Card Vendor Code for the booking.",
          },
          cardNumber: {
            type: "string",
            description: "Credit Card Number for the booking.",
          },
          expiryDate: {
            type: "string",
            description: "Expiry date of the credit card in 'YYYY-MM' format.",
          },
          holderName: {
            type: "string",
            description: "Name of the cardholder.",
          },
        },
        required: [
          "guests",
          "hotelOfferId",
          "cardVendorCode",
          "cardNumber",
          "expiryDate",
          "holderName",
        ],
      },
    },
  },
};

export { apiTool };
