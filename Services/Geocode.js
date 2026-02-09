const Nodegeocoder = require("node-geocoder");

let geocoder = null;

const getGeocoder = () => {
  if (!geocoder) {
    const TOMTOM_API = process.env.TOMTOM_API_Key;

    if (!TOMTOM_API) {
      throw new Error("TOMTOM_API_Key is not set in environment variables");
    }

    const options = {
      provider: "tomtom",
      apiKey: TOMTOM_API,
      formatter: null,
    };

    geocoder = Nodegeocoder(options);
  }

  return geocoder;
};

module.exports = { getGeocoder };
