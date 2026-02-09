const { getGeocoder } = require("../Services/Geocode");

const getLatLog = async (req, res) => {
  const { address } = req.body || req.query;
  try {
    const geocoder = getGeocoder();
    const response = await geocoder.geocode(address);
    if (response.length === 0) {
      return res.status(404).json({ error: "Address not found" });
    }
    const bestmatch = response[0];
    res.json({
      success: true,
      address: bestmatch.formattedAddress,
      latitude: bestmatch.latitude,
      longitude: bestmatch.longitude,
      country: bestmatch.country,
      city: bestmatch.city,
      state: bestmatch.state,
      zipcode: bestmatch.zipcode,
    });
    console.log(bestmatch);
  } catch (error) {
    res.status(500).json({ error: "Geocoding failed" });
  }
};
module.exports = getLatLog;
