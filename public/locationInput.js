// Hardcoded donor location (latitude and longitude)
const donorLocation = { lat: 19.0822, lng: 72.8812 }; // Example: Mumbai, India

document.getElementById("locationForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const userAddress = document.getElementById("userAddress").value;

    // Get user's latitude and longitude using an external geocoding API
    const geocodeResponse = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            userAddress
        )}&key=8df4a5068e914aa78ae1aacf37d0e4a4`
    );
    const geocodeData = await geocodeResponse.json();
    const userLocation = geocodeData.results[0].geometry;

    // Calculate distance using the Haversine formula
    const distance = calculateDistance(
        donorLocation.lat,
        donorLocation.lng,
        userLocation.lat,
        userLocation.lng
    );

    // Show result based on distance
    const resultDiv = document.getElementById("result");
    if (distance <= 20) {
        resultDiv.innerHTML = `
            <p>Delivery is possible (${distance.toFixed(2)} km).</p>
            <a href="/tracking" class="cta-btn">Proceed to Tracking</a>
        `;
    } else {
        resultDiv.innerHTML = `<p>Sorry, delivery is not available. (${distance.toFixed(2)} km away)</p>`;
    }
});

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}
