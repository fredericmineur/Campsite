mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

var marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(`<h6>${campground.title}</h6><p>${campground.location}</p>`)
        )
    .addTo(map);

// var popup = new mapboxgl.Popup({offset:25})
//     .setLngLat(campground.geometry.coordinates)
//     .setHTML(`<h1>${campground.geometry.coordinates}</h1>`)
//     .addTo(map);