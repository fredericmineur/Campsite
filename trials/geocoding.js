if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mbxGecoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGecoding({accessToken:process.env.MAPBOX_TOKEN})

geocodingClient.forwardGeocode({
    query: 'Paris, France',
    limit: 2
  })
    .send()
    .then(response => {
    //   const match = response.body;
      console.log(response);
    });