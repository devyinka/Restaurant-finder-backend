const axios = require("axios");

const Getrestaurant = async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required" });
  }
  try {
    const TOMTOM_API_Key = process.env.TOMTOM_API_Key;
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const url = `https://api.tomtom.com/search/2/search/restaurant.json?`;
    const response = await axios.get(url, {
      params: {
        key: TOMTOM_API_Key,
        lat: latNum,
        lon: lngNum,
        radius: 5000,
        limit: 25,
        categorySet: 7315,
        view: "Unified",
      },
    });

    const restuarants = await Promise.all(
      response.data.results.map(async (place, index) => {
        let isOpenNow;
        let statusText;
        const randomstatus = Math.random();
        if (randomstatus < 0.5) {
          isOpenNow = true;
          statusText = "Open Now";
        } else {
          isOpenNow = false;
          statusText = "Closed Temporarily";
        }
        // Fetch restaurant/cafe exterior images from Pexels
        let imageUrl = `https://picsum.photos/seed/${place.id || index}/600/400`; // fallback
        if (PEXELS_API_KEY) {
          try {
            // Use building/architecture keywords for restaurant exteriors
            const buildingKeywords = [
              "restaurant exterior",
              "cafe storefront",
              "cafe entrance",
              "restaurant building",
              "hotel entrance",
              "bistro front",
              "coffee shop exterior",
            ];
            const randomKeyword =
              buildingKeywords[
                Math.floor(Math.random() * buildingKeywords.length)
              ];
            const randomPage = Math.floor(Math.random() * 5) + 1; // Random page 1-5

            const pexelsRes = await axios.get(
              `https://api.pexels.com/v1/search?query=${randomKeyword}&per_page=1&page=${randomPage}`,
              {
                headers: { Authorization: PEXELS_API_KEY },
              },
            );
            if (pexelsRes.data.photos && pexelsRes.data.photos[0]) {
              imageUrl = pexelsRes.data.photos[0].src.medium;
            }
          } catch (err) {
            console.warn(
              "Pexels image fetch failed, using fallback:",
              err.message,
            );
          }
        }
        return {
          id: place.id,
          name: place.poi.name,
          address: place.address.freeformAddress,
          phone: place.poi.phone,
          latitude: place.position.lat,
          longitude: place.position.lon,
          distance: `${Math.round(place.dist)} meters away`,
          isOpenNow: isOpenNow,
          statusText: statusText,
          imageUrl: imageUrl,
          rating: (Math.random() * 5).toFixed(1),
          reviews: Math.floor(Math.random() * 500) + 1,
        };
      }),
    );
    console.log(restuarants);

    res.json({
      success: true,
      data: restuarants,
      count: restuarants.length,
    });
  } catch (error) {
    const errorMsg = error.response?.data || error.message;
    console.error("Error fetching restaurants:", errorMsg);
    res
      .status(500)
      .json({ error: "Failed to fetch restaurants", details: errorMsg });
  }
};

module.exports = Getrestaurant;
