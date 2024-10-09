const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { laltitude, longitude } = position.coords;
            socket.emit("send-location", { laltitude, longitude});
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            Timeout: 5000,
            maximumAge: 0
        }
    );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Ayush's Map"
}).addTo(map)

const markers = {};

socket.on("receive-location", (data)=>{
    const {id, laltitude, longitude} = data;
    map.setView([laltitude, longitude], 16);
    if (markers[id]) {
        markers[id].setLatLng([laltitude, longitude]);
    } else {
        markers[id] = L.marker([laltitude, longitude]).addTo(map);
    }
}) ;

socket.on("user-disconnected", (id) => {
    if (marker[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});