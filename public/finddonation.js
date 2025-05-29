
// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);  // Default view (London coordinates)

// Set OpenStreetMap as the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Predefined donation centers with coordinates (for demonstration)
const donationCenters = [
    { name: "Food Bank A", lat: 40.730610, lng: -73.935242, address: "123 Main St, City A" },
    { name: "Food Bank B", lat: 40.650002, lng: -73.949997, address: "456 Oak St, City B" },
    { name: "Food Bank C", lat: 40.730610, lng: -73.900000, address: "789 Pine St, City C" }
];

// Function to show donation centers on the map
function showDonationCenters(userLat, userLon) {
    // Clear previous markers
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Filter donation centers within 50 km radius
    donationCenters.forEach(center => {
        const distance = calculateDistance(userLat, userLon, center.lat, center.lng);

        // Only show centers within 50 km
        if (distance <= 50) {
            const marker = L.marker([center.lat, center.lng]).addTo(map);
            marker.bindPopup(`<b>${center.name}</b><br>${center.address}`);
        }
    });
}

// Calculate the distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

// Convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Function to search donation centers based on user input (city/zip)
function searchDonationCenters() {
    const locationQuery = document.getElementById("search-input").value;

    if (locationQuery) {
        // Geocode the location input using OpenStreetMap Nominatim API
        fetch(`https://nominatim.openstreetmap.org/search?q=${locationQuery}&format=json&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data[0]) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);

                    // Center the map on the geocoded location
                    map.setView([lat, lon], 13);

                    // Show donation centers near this location
                    showDonationCenters(lat, lon);
                } else {
                    alert("Location not found. Please try again.");
                }
            })
            .catch(error => {
                console.error("Geocoding error:", error);
                alert("An error occurred while geocoding the location.");
            });
    } else {
        alert("Please enter a location.");
    }
}

