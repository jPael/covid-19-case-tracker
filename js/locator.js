const mymap = L.map("covidMap");
const attribution =
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const tiles = L.tileLayer(tileURL, { attribution: attribution });
tiles.addTo(mymap);
// var myIcon = L.icon({
//     iconUrl: "320px-International_Space_Station.svg.png",
//     iconSize: [50, 32],
//     iconAnchor: [25, 16],
// });
// const marker = L.marker([0, 0], { icon: myIcon });
const marker = L.marker([0, 0]);

function setLocations(datas) {
    mymap.setView([13, 122], 6);
    datas.forEach((data) => {
        marker.setLatLng([data.lat, data.lon]);
        // marker.bindPopup(data.cases).openPopup();
        marker.bindTooltip(data.cases).openTooltip();
        marker.addTo(mymap);
    });
}
