const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Get coordinates of a city
const getCoords = async (city) => {
  const response = await axios.get(
    "https://api.opentripmap.com/0.1/en/places/geoname",
    {
      params: {
        name: city,
        apikey: process.env.OPENTRIPMAP_API_KEY,
      },
    }
  );
  return { lat: response.data.lat, lon: response.data.lon };
};

// Get attractions around coordinates
const getAttractions = async (lat, lon, days) => {
  const limit = days * 3;
  const response = await axios.get(
    "https://api.opentripmap.com/0.1/en/places/radius",
    {
      params: {
        radius: 10000,
        lon,
        lat,
        rate: 2,
        format: "json",
        limit,
        apikey: process.env.OPENTRIPMAP_API_KEY,
      },
    }
  );

  return response.data.map((place) => ({
    name: place.name,
    kind: place.kinds,
    dist: place.dist,
  }));
};

const getHotelsFromFallback = async (lat, lon) => {
  try {
    const tokenRes = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const token = tokenRes.data.access_token;

    const response = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode",
      {
        params: {
          latitude: lat,
          longitude: lon,
          radius: 20,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.data.map((hotel) => ({
      name: hotel.name,
      hotelId: hotel.hotelId,
      distance: hotel.distance.value,
      distanceUnit: hotel.distance.unit,
    }));
  } catch (err) {
    console.error("Fallback hotel-list error:", err.message);
    return [];
  }
};

const getHotelsFromAmadeus = async (
  lat,
  lon,
  checkInDate,
  nights,
  adults = 2,
  rooms = 1
) => {
  try {
    // Step 1: Auth Token
    const tokenRes = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = tokenRes.data.access_token;

    // Step 2: Get nearby hotel IDs
    const hotelSearchRes = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode",
      {
        params: {
          latitude: lat,
          longitude: lon,
          radius: 20,
          radiusUnit: "KM",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const hotelIds = hotelSearchRes.data.data
      .map((hotel) => hotel.hotelId)
      .slice(0, 10); // Limit to top 10 for performance

    if (!hotelIds.length) return [];

    // Step 3: Get hotel offers using IDs
    const offersRes = await axios.get(
      "https://test.api.amadeus.com/v3/shopping/hotel-offers",
      {
        params: {
          hotelIds: hotelIds.join(","),
          checkInDate,
          roomQuantity: rooms,
          adults,
          paymentPolicy: "NONE",
          bestRateOnly: true,
          view: "FULL",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let hotels = offersRes.data.data.map((hotel) => ({
      name: hotel.hotel.name,
      address: hotel.hotel.address?.lines?.join(", ") || "No Address",
      rating: hotel.hotel.rating || "Not Rated",
      price: hotel.offers[0]?.price?.total || "N/A",
      currency: hotel.offers[0]?.price?.currency || "",
      image: hotel.hotel.media?.[0]?.uri || null,
    }));

    if (hotels.length < 3) {
      const fallbackHotels = await getHotelsFromFallback(lat, lon);
      hotels = [...hotels, ...fallbackHotels];
    }

    return hotels;
  } catch (error) {
    console.error("Amadeus error:", error.response?.data || error.message);
    return [];
  }
};

// Main API endpoint
app.post("/api/trip-plan", async (req, res) => {
  const {
    location,
    checkinDate,
    nights,
    members,
    rooms,
    budgetMin,
    budgetMax,
  } = req.body;

  if (!location || !checkinDate || !nights || !members || !rooms) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const coords = await getCoords(location);
    const attractions = await getAttractions(coords.lat, coords.lon, nights);
    let hotels = await getHotelsFromAmadeus(
      coords.lat,
      coords.lon,
      checkinDate,
      nights,
      members,
      rooms
    );

    if (budgetMin && budgetMax) {
      hotels = hotels.filter((hotel) => {
        const price = parseFloat(hotel.price);

        // If the price is invalid (NaN), exclude the hotel
        if (isNaN(price)) {
          return true;
        }

        // Otherwise, apply the budget filter
        return price >= parseFloat(budgetMin) && price <= parseFloat(budgetMax);
      });
    }

    hotels = hotels.slice(0, 10);
    console.log(hotels);

    res.json({
      location,
      nights,
      checkinDate,
      members,
      rooms,
      budgetMin,
      budgetMax,
      coords,
      hotels,
      attractions,
    });
  } catch (error) {
    console.error("Trip plan error:", error.message);
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
