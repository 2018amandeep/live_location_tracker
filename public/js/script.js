const socket = io();
console.log("hey " + socket)
console.log(navigator," navigator")

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        console.log(position," position")
        const { latitude, longitude }  = position.coords;

        // Emiting event from front end
        socket.emit("send-location", { latitude, longitude });
    }, (error)=> {
        console.error(error)
    },
     {
        enableHighAccurancy: true,
        timeout:5000,
        maximumAge:0  // remove cache
     }) // check the position of person if a person is moving
}

const map = L.map("map").setView([0,0], 10);  // [0,0]cordinates, 10-< zoom level

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Amandeep Coding Platform'
}).addTo(map);

const markers = {};

socket.on("receive-location", (data)=>{
    const { latitude, longitude, id } = data;
        if(markers[id]){
            markers[id].setLatLng([latitude, longitude]);
        } else {
            markers[id] = L.marker([latitude, longitude]).addTo(map);
        }

    map.setView([latitude, longitude],16)
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})